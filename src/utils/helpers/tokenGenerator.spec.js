const jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  generate (id) {
    this.id = id

    this.token = jwt.sign(id, this.secret)
    return this.token
  }
}

const makeSut = () => {
  const sut = new TokenGenerator('secret')
  return {
    sut
  }
}

describe('Token Generator tests', () => {
  test('Ensure that TokenGenerator returns null if JWT returns null', async () => {
    const { sut } = makeSut()
    jwt.token = null
    const token = await sut.generate()
    expect(token).toBeNull()
  })

  test('Ensure that TokenGenerator returns a token when JWT returns a token', async () => {
    const { sut } = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('Ensure that JWT is called with correct values', async () => {
    const { sut } = makeSut()
    await sut.generate('any_id')
    expect(sut.id).toBe(jwt.id)
    expect(sut.secret).toBe(jwt.secret)
  })
})

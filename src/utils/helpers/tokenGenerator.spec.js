const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missingParamError')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    if (!id) {
      throw new MissingParamError('id')
    } else if (!this.secret) {
      throw new MissingParamError('secret')
    }

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
    const token = await sut.generate('any_id')
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

  test('Ensure that TokenGenerator throws if id is not provided', async () => {
    const { sut } = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  test('Ensure that TokenGenerator throws when secret is null', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })
})

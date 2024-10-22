const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

describe('Test integration of Encrypter', () => {
  test('Ensure that encrypter returns true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = true
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Ensure that encrypter returns false when bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('Ensure that bcrypt is receiving the right values', async () => {
    const sut = new Encrypter()
    const value = 'any_value'
    const hash = 'hashed_value'

    await sut.compare(value, hash)
    expect(bcrypt.value).toBe(value)
    expect(bcrypt.hash).toBe(hash)
  })
})

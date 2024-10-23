const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missingParamError')
const Encrypter = require('./encrypter')

const makeSut = () => {
  const sut = new Encrypter()
  return {
    sut
  }
}

describe('Test integration of Encrypter', () => {
  test('Ensure that encrypter returns true if bcrypt returns true', async () => {
    const { sut } = makeSut()
    bcrypt.isValid = true
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Ensure that encrypter returns false when bcrypt returns false', async () => {
    const { sut } = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('Ensure that bcrypt is receiving the right values', async () => {
    const { sut } = makeSut()
    const value = 'any_value'
    const hash = 'hashed_value'

    await sut.compare(value, hash)
    expect(bcrypt.value).toBe(value)
    expect(bcrypt.hash).toBe(hash)
  })

  test('Ensure that Encrypter throws when no parameters are received', async () => {
    const { sut } = makeSut()
    const promise = sut.compare()

    expect(promise).rejects.toThrow(new MissingParamError('Password or Hash'))
    expect(sut.compare('any_password')).rejects.toThrow(new MissingParamError('Password or Hash'))
  })
})

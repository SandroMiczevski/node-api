const EmailValidator = require('./emailValidator')
const validator = require('validator')

const makeSut = () => {
  const sut = new EmailValidator()

  return {
    sut
  }
}

describe('Email Validator', () => {
  test('Returns true if valid email is provided', () => {
    const { sut } = makeSut()
    const emailIsValid = sut.isValid('valid_email@email.com')
    expect(emailIsValid).toBe(true)
  })

  test('Returns false if email provided is false', () => {
    validator.isEmailValid = false
    const { sut } = makeSut()
    const emailIsValid = sut.isValid('invalid_email@email.com')
    expect(emailIsValid).toBe(false)
  })

  test('emailValidator is receiving the right parameter', () => {
    const email = 'email@email.com'
    const { sut } = makeSut()
    sut.isValid(email)
    expect(validator.email).toBe(email)
  })
})

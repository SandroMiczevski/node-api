const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('Returns true if valid email is provided', () => {
    const sut = new EmailValidator()
    const emailIsValid = sut.isValid('valid_email@email.com')
    expect(emailIsValid).toBe(true)
  })

  test('Returns false if email provided is false', () => {
    validator.isEmailValid = false
    const sut = new EmailValidator()
    const emailIsValid = sut.isValid('invalid_email@email.com')
    expect(emailIsValid).toBe(false)
  })
})

const validator = require('validator')
const MissingParamError = require('../errors/missingParamError')

module.exports = class EmailValidor {
  isValid (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
    return validator.isEmail(email)
  }
}

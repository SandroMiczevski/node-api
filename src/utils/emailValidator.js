const validator = require('validator')

module.exports = class EmailValidor {
  isValid (email) {
    return validator.isEmail(email)
  }
}

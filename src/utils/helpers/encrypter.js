const MissingParamError = require('../errors/missingParamError')
const bcrypt = require('bcrypt')

module.exports = class Encrypter {
  async compare (value, hash) {
    if (!value || !hash) {
      throw new MissingParamError('Password or Hash')
    }
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

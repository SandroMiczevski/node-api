const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missingParamError')

module.exports = class TokenGenerator {
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

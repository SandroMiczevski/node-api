const MissingParamError = require('../errors/missingParamError')
const InvalidParamError = require('../errors/InvalidParamError')
const UnauthorizedError = require('../errors/unauthorizedParamError')
const ServerError = require('../errors/serverError')

module.exports = {
  MissingParamError,
  InvalidParamError,
  UnauthorizedError,
  ServerError
}

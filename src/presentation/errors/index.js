const MissingParamError = require('../../utils/errors/missingParamError')
const InvalidParamError = require('../../utils/errors/InvalidParamError')
const UnauthorizedError = require('../errors/unauthorizedParamError')
const ServerError = require('../errors/serverError')

module.exports = {
  MissingParamError,
  InvalidParamError,
  UnauthorizedError,
  ServerError
}

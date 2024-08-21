const MissingParamError = require('./missingParamError')
const UnauthorizedError = require('./unauthorizedParamError')
module.exports = class httpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError (paramName) {
    return {
      statusCode: 500,
      body: new MissingParamError(paramName)
    }
  }

  static accessDenied (paramName) {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}

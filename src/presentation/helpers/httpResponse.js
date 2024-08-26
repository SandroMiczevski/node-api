const MissingParamError = require('./missingParamError')
const UnauthorizedError = require('./unauthorizedParamError')
const ServerError = require('./serverError')

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
      body: new ServerError()
    }
  }

  static accessDenied (paramName) {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static authSuccessful (accessToken) {
    return {
      statusCode: 200,
      body: { accessToken }
    }
  }
}

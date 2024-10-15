const httpResponse = require('../helpers/httpResponse')
const { MissingParamError, InvalidParamError, UnauthorizedError, ServerError } = require('../errors')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (email == null) {
        return httpResponse.badRequest(new MissingParamError('email'))
      } else if (password == null) {
        return httpResponse.badRequest(new MissingParamError('password'))
      }

      if (!this.emailValidator.isValid(email)) {
        return httpResponse.badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authUseCase.auth(email, password)

      if (!accessToken) {
        return httpResponse.accessDenied(new UnauthorizedError('Unauthorized'))
      }

      return httpResponse.authSuccessful(accessToken)
    } catch (error) {
      console.error(error)
      return httpResponse.serverError(new ServerError())
    }
    // }

    // return httpResponse.serverError('httpRequest')
  }
}

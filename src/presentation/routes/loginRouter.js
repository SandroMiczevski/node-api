const httpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest ||
        !httpRequest.body ||
        !this.authUseCase) {
      return httpResponse.serverError('httpRequest')
    }

    const { email, password } = httpRequest.body

    if (email == null) {
      return httpResponse.badRequest('email')
    } else if (password == null) {
      return httpResponse.badRequest('password')
    }

    this.authUseCase.auth(email, password)

    return httpResponse.accessDenied('Unauthorized')

    // return httpResponse
  }
}

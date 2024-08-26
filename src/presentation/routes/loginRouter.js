const httpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
  //  if (!httpRequest || !httpRequest.body || !this.authUseCase) {
    try {
      const { email, password } = httpRequest.body

      if (email == null) {
        return httpResponse.badRequest('email')
      } else if (password == null) {
        return httpResponse.badRequest('password')
      }

      const accessToken = this.authUseCase.auth(email, password)

      if (!accessToken) {
        return httpResponse.accessDenied('Unauthorized')
      }

      return httpResponse.authSuccessful(accessToken)
    } catch (error) {
      return httpResponse.serverError()
    }
    // }

    // return httpResponse.serverError('httpRequest')
  }
}

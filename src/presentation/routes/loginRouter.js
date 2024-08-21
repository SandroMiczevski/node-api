const httpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return httpResponse.serverError('httpRequest')
    }

    const { email, password } = httpRequest.body

    if (email == null) {
      return httpResponse.badRequest('email')
    } else if (password == null) {
      return httpResponse.badRequest('password')
    }

    return httpResponse
  }
}

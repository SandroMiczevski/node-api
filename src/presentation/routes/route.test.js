const LoginRouter = require('./loginRouter')
const MissingParamError = require('../helpers/missingParamError')

describe('Login Router', () => {
  test('Returns statusCode 400 if email is not provided', () => {
    // System Under Test - SUT
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'random_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Returns statusCode 400 if password is not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'email@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Returns statusCode 500 when LoginRoute is receiveing empty httpRequest', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new MissingParamError('httpRequest'))
  })

  test('Return statusCode 500 if httpRequest has no body', () => {
    const sut = new LoginRouter()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new MissingParamError('httpRequest'))
  })
})

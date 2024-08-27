const LoginRouter = require('./loginRouter')
const MissingParamError = require('../helpers/missingParamError')
const UnauthorizedError = require('../helpers/unauthorizedParamError')
const ServerError = require('../helpers/serverError')
const InvalidParamError = require('../helpers/InvalidParamError')

class AuthUseCaseSpy {
  async auth (email, password) {
    this.email = email
    this.password = password
    return this.accessToken
  }
}

class EmailValidatorSpy {
  isValid (email) {
    //   var emailFormat = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    //   return (email.match(emailFormat))
    return this.isEmailValid
  }
}

const makeSut = () => {
  // Test double. This is just to mock the behaviour of the Authentication class
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true

  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

describe('Login Router', () => {
  test('Returns statusCode 400 if email is not provided', async () => {
    // System Under Test - SUT
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'random_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Returns statusCode 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Returns statusCode 500 when LoginRoute is receiveing empty httpRequest', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Return statusCode 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Calls AuthUseCase with the right parameters', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Returns statusCode 500 if AuthUseCase is not provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Returns statusCode 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError('Unauthorized'))
  })

  test('Returns statusCode 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken)
  })

  test('Returns statusCode 500 if authUseCase fails and throw an error', async () => {
    class AuthUseCaseSpyError {
      async auth (email, password) {
        throw new Error()
      }
    }

    const authUseCaseError = new AuthUseCaseSpyError()
    const sut = new LoginRouter(authUseCaseError)

    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: '_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Returns statusCode 400 if email does not meet email criteria', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid-email@',
        password: 'password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})

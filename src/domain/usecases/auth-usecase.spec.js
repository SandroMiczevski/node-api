const MissingParamError = require('../../utils/errors/missingParamError')
const AuthUseCase = require('./authUseCase')

const makeEncrypter = () => {
  class Encrypter {
    async compare (password) {
      this.password = password
      this.hashedPassword = 'hashed_password'
      return this.isValid
    }
  }

  const encrypterSpy = new Encrypter()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepository {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository()

  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate (userID) {
      this.userID = userID
      return this.accessToken
    }
  }

  const TokenGeneratorSpy = new TokenGenerator()
  TokenGeneratorSpy.accessToken = 'access_token'

  return TokenGeneratorSpy
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepository {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepository()
  return updateAccessTokenRepositorySpy
}

//* **************  SUTs WITH Errors ***************

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare (password) {
      throw new Error()
    }
  }
  return new EncrypterSpy()
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      throw new Error()
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      throw new Error()
    }
  }
  return new TokenGeneratorSpy()
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepository {
    async update (userId, accessToken) {
      throw new Error()
    }
  }
  return new UpdateAccessTokenRepository()
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('AuthUseCase', () => {
  test('authUseCase throws an error if email is not provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('authUseCase throws an error if password is not provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@email.com')
  })

  test('Authentication method returns null if loadUserByEmailRepository returns null', async () => {
    // const { sut } = makeSut()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    loadUserByEmailRepositorySpy.user = null

    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: makeEncrypter()
    })

    const accessToken = await sut.auth('any_email@email.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Authentication method returns null if wrong password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('any_email@email.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('Encrypter is being called with right values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Ensure that authUseCase is calling TokenGenerator with correct userID', async () => {
    const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')

    expect(tokenGeneratorSpy.userID).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Ensure that TokenGenerator is returning a valid accessToken', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('any_email@email.com', 'any_password')

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy() // Check if the object is not null/false/etc
  })

  test('Ensure that updateAccessTokenRepository receives the right parameters', async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      updateAccessTokenRepositorySpy
    } = makeSut()

    const accessToken = await sut.auth('any_email@email.com', 'any_password')

    expect(accessToken).toBe(updateAccessTokenRepositorySpy.accessToken)
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Throws an error if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepositoryTmp = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    // const updateAccessTokenRepository = makeUpdateAccessTokenRepository()

    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({ loadUserByEmailRepository: null }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositoryTmp,
        encrypter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositoryTmp,
        encrypter
      }),
      new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositoryTmp,
        encrypter,
        tokenGenerator: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositoryTmp,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: invalid
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Throws an error if any of the dependencies throws and error', async () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const encrypterSpy = makeEncrypter()
    const tokenGeneratorSpy = makeTokenGenerator()
    const updateAccessTokenRepository = makeUpdateAccessTokenRepository()

    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
        encrypterSpy,
        tokenGeneratorSpy,
        updateAccessTokenRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepositorySpy,
        encrypter: makeEncrypterWithError(),
        tokenGeneratorSpy,
        updateAccessTokenRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepositorySpy,
        encrypterSpy,
        tokenGenerator: makeTokenGeneratorWithError(),
        updateAccessTokenRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepositorySpy,
        encrypterSpy,
        tokenGeneratorSpy,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError()
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('some_email@email.com', 'password')
      expect(promise).rejects.toThrow()
    }
  })
})

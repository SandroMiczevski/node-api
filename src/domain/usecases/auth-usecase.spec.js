const MissingParamError = require('../../utils/errors/missingParamError')
const AuthUseCase = require('./authUseCase')

class LoadUserByEmailRepository {
  email = ''

  async load (email) {
    this.email = email
    return this.user
  }
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository()
  loadUserByEmailRepositorySpy.user = {}

  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return {
    sut,
    loadUserByEmailRepositorySpy
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

  test('Throws an error if no loadUserByEmailRepository is provided', async () => {
    // const sut = makeSut()
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  test('Authentication method returns null if loadUserByEmailRepository returns null', async () => {
    // const { sut } = makeSut()
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository()
    loadUserByEmailRepositorySpy.user = null
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
    const accessToken = await sut.auth('any_email@email.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Authentication method returns null if wrong password is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('any_email@email.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
})

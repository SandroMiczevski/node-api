const MissingParamError = require('../../utils/errors/missingParamError')

const makeSut = () => {
  const sut = new AuthUseCase()

  return {
    sut
  }
}

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    } else if (!password) {
      throw new MissingParamError('password')
    }
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
})

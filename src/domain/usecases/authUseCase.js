const MissingParamError = require('../../utils/errors/missingParamError')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypter) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    } else if (!password) {
      throw new MissingParamError('password')
    } else if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository')
    }

    const user = this.loadUserByEmailRepository.load(email)

    if (!user) {
      return null
    }

    await this.encrypter.compare(password)

    return null
  }
}

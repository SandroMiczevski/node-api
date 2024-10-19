const MissingParamError = require('../../utils/errors/missingParamError')

module.exports = class AuthUseCase {
  constructor (args = {}) {
    this.loadUserByEmailRepository = args.loadUserByEmailRepository
    this.encrypter = args.encrypter
    this.tokenGenerator = args.tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    } else if (!password) {
      throw new MissingParamError('password')
    }

    // Ensuring that the user has valid e-mail and password
    const user = await this.loadUserByEmailRepository.load(email)
    const isValid = await this.encrypter.compare(password)

    if (user && isValid) {
      // Generates accessToken
      const accessToken = await this.tokenGenerator.generate(user.id)
      return accessToken
    }

    return null
  }
}

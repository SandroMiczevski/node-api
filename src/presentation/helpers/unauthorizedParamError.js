module.exports =
class UnauthorizedError extends Error {
  constructor (paramName) {
    super('Unathorized access')
    this.name = paramName
  }
}

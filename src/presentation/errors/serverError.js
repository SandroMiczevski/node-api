module.exports = class serverError extends Error {
  constructor (params) {
    params
      ? super(`Server Error: ${params}`)
      : super('Internal error')

    this.name = 'ServerError'
  }
}

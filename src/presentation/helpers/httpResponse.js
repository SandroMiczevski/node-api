module.exports = class httpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError (error) {
    return {
      statusCode: 500,
      body: error
    }
  }

  static accessDenied (error) {
    return {
      statusCode: 401,
      body: error
    }
  }

  static authSuccessful (accessToken) {
    return {
      statusCode: 200,
      body: { accessToken }
    }
  }
}

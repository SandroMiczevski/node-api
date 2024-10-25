class TokenGenerator {
  generate () {
    return null
  }
}

describe('Token Generator tests', () => {
  test('Should return null if JWT returns null', () => {
    const sut = new TokenGenerator()
    const token = sut.generate()
    expect(token).toBe(null)
  })
})

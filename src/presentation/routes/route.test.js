class LoginRouter{
    route(httpRequest){
        const httpResponse = {
            statusCode : 200
        }

        if (httpRequest.body.email == null){
            httpResponse.statusCode = 400;
            return httpResponse;
        }
    }
}



describe('Login Router', () => {
    test('Should return code 400 if email is not provided', () => {
        //System Under Test - SUT
        const sut = new LoginRouter()
        const httpRequest = {
            body : {
                password: 'random_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})
class LoginRouter{
    route(httpRequest){
        
        const httpResponse = {
            statusCode : 200
        }
        
        if (!httpRequest || !httpRequest.body) return (httpResponse.statusCode = 500) 

        const {email , password} = httpRequest.body

        if (email == null || password == null){
            httpResponse.statusCode = 400;
            return httpResponse;
        }

        return httpResponse
    }
}



describe('Login Router', () => {
    test('Returns statusCode 400 if email is not provided', () => {
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

    test('Returns statusCode 400 if password is not provided', () => {
        const sut = new LoginRouter();
        const httpRequest = {
            body : {
                email: 'email@email.com'
            }
        }
        const httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
    })

    test('Returns statusCode 500 when LoginRoute is receiveing empty httpRequest', () =>{
        const sut = new LoginRouter();
        const httpResponse = sut.route();
        expect(httpResponse).toBe(500);
    })

    test ('Return statusCode 500 if httpRequest has no body', () => {
        const sut = new LoginRouter()
        const httpRequest = {}
        const httpResponse = sut.route(httpRequest);
        expect(httpResponse).toBe(500)
    })
});
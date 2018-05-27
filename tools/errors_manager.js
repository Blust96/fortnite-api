module.exports = {

    getError: (errCode) => {

        switch (errCode) {

            case 3:
                return {
                    'httpCode': 400,
                    'error': {
                        'code': errCode,
                        'message': 'Bad Request',
                        'description': 'Invalid parameters. The platform or gamemode provided as parameters were not valid for the request.'
                    }
                };
                break;
            case 32:
                return {
                    'httpCode': 401,
                    'error': {
                        'code': errCode,
                        'message': 'Could not authenticate you',
                        'description': 'There was an issue with the authentication data for the request.'
                    }
                }
                break;
            case 99:
                return {
                    'httpCode': 403,
                    'error': {
                        'code': errCode,
                        'message': 'Unable to verify your credentials',
                        'description': 'The Oauth credentials cannot be validated. Check that the token is still valid.'
                    }
                }
                break;
            case 17:
                return {
                    'httpCode': 404,
                    'error': {
                        'code': errCode,
                        'message': 'No player found for this username',
                        'description': 'It was not possible to find a user profile matching the specified parameters.'
                    }
                }
                break;
            case 34:
                return {
                    'httpCode': 404,
                    'error': {
                        'code': errCode,
                        'message': 'Sorry, wrong route specified',
                        'description': 'The specified resource was not found.'
                    }
                }
                break;
            case 131:
            default:
                return {
                    'httpCode': 500,
                    'error': {
                        'code': errCode,
                        'message': 'Internal Server Error',
                        'description': 'An unknow internal error occurred.'
                    }
                }
                break;

        }

    }

}
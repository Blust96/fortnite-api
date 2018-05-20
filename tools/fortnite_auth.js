const EndPoint = require('../config/endpoints.js');
const rp = require('request-promise');

class FortniteAuth {

    constructor(credentials) {

        if(credentials && credentials.constructor === Array && credentials.length == 4) {
            this.credentials = credentials;
        } else {
            console.log('Credentials are not correct');
        }

    }

    login() {

        return new Promise((resolve, reject) => {

            const tokenConfig = {
                grant_type: "password",
                username: this.credentials[0],
                password: this.credentials[1],
                includePerms: true
            };

            // GET TOKEN
            rp({
                url: EndPoint.OAUTH_TOKEN,
                headers: {
                    Authorization: "basic " + this.credentials[2]
                },
                form: tokenConfig,
                method: "POST",
                json: true
            })
            .then(data => {
                this.access_token = data.access_token;
                // rp 2
                rp({
                    url: EndPoint.OAUTH_EXCHANGE,
                    headers: {
                        Authorization: "bearer " + this.access_token
                    },
                    method: "GET",
                    json: true
                })
                .then(data => {
                    this.code = data.code;
                    //rp 3
                    rp({
                        url: EndPoint.OAUTH_TOKEN,
                        headers: {
                            Authorization:
                            "basic " + this.credentials[3]
                        },
                        form: {
                            grant_type: "exchange_code",
                            exchange_code: this.code,
                            includePerms: true,
                            token_type: "egl"
                        },
                        method: "POST",
                        json: true
                    })
                    .then(data => {
                        this.expires_at = data.expires_at;
                        this.access_token = data.access_token;
                        this.refresh_token = data.refresh_token;
                        resolve(this.expires_at);
                    })
                    .catch(err => {
                        reject(err);
                    });
                })
                .catch(err => {
                    reject(err);
                });
            })
            .catch(() => {
                reject("Please enter good token");
            });
        });
    }

}

module.exports = FortniteAuth;
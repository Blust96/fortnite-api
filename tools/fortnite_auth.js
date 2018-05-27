const endPoint = require('../config/endpoints.js');
const fortniteTools = require('./fortnite_tools.js');
const rp = require('request-promise');

class FortniteAuth {

    constructor(credentials) {

        if(credentials && credentials.constructor === Array && credentials.length == 4) {
            this.credentials = credentials;
        } else {
            console.log('Credentials are not correct');
        }

        setInterval(() => {
            this.checkToken();
        }, 1000);

    }

    checkToken() {

        // Dates initialisation
        let actualDate = new Date();
        let expireDate = new Date(new Date(this.expires_at).getTime() - 15 * 60000);

        // If access_token and expirates_at exists
        if (this.access_token && this.expires_at && expireDate < actualDate) {

            this.expires_at = undefined;

            // Token regeneration
            rp({
                url: endPoint.OAUTH_TOKEN,
                headers: {
                    Authorization: "basic " + this.credentials[3]
                },
                form: {
                    grant_type: "refresh_token",
                    refresh_token: this.refresh_token,
                    includePerms: true
                },
                method: "POST",
                json: true
            })
            .then(data => {
                this.expires_at = data.expires_at;
                this.access_token = data.access_token;
                this.refresh_token = data.refresh_token;
            })
            .catch(err => {
                console.log("Unable to regenerate token");
                throw new Error(err);
            });

        }
    }

    login() {

        return new Promise((resolve, reject) => {

            // Token options
            const tokenConfig = {
                grant_type: "password",
                username: this.credentials[0],
                password: this.credentials[1],
                includePerms: true
            };

            // Token generation
            rp({
                url: endPoint.OAUTH_TOKEN,
                headers: {
                    Authorization: "basic " + this.credentials[2]
                },
                form: tokenConfig,
                method: "POST",
                json: true
            })
            .then(data => {

                this.access_token = data.access_token;

                // If access_token has been found
                rp({
                    url: endPoint.OAUTH_EXCHANGE,
                    headers: {
                        Authorization: "bearer " + this.access_token
                    },
                    method: "GET",
                    json: true
                })
                .then(data => {

                    this.code = data.code;

                    // If code has been found
                    rp({
                        url: endPoint.OAUTH_TOKEN,
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
                        // Saving token informations into vars
                        this.expires_at = data.expires_at;
                        this.access_token = data.access_token;
                        this.refresh_token = data.refresh_token;
                        resolve(this.expires_at);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(131);
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject(131);
                });
            })
            .catch(() => {
                reject(131);
            });
        });
    }

    lookup(username) {

        return new Promise((resolve, reject) => {

            rp({
                url: endPoint.lookup(username),
                headers: {
                    Authorization: "bearer " + this.access_token
                },
                method: "GET",
                json: true
            })
            .then(user => {
                resolve(user);
            })
            .catch(err => {
                reject(err);
            });

        });

    }

    getStatsBR(username, platform) {

        return new Promise((resolve, reject) => {

            this.lookup(username)

                .then(user => {

                    rp({
                        url: endPoint.statsBR(user.id),
                        headers: {
                            Authorization: "bearer " + this.access_token
                        },
                        method: "GET",
                        json: true
                    })
                    .then(stats => {
                        if (fortniteTools.checkStatsPlatform(stats, platform.toLowerCase() || "pc")) {
                            fortniteTools.convert(stats, user, platform.toLowerCase())
                            .then(resultStats => {
                                resolve(resultStats);
                            });
                        } else {
                            // Wrong username, canno't find user
                            reject(17);
                        }
                    })
                    .catch(err => {
                        // Wrong username, canno't find user
                        console.log(err);
                        reject(131);
                    });
                })
                .catch((err) => {
                    console.log(err);
                    // Wrong username, canno't find user
                    reject(17);
                });

        });

    }

    checkPlayer(username, platform) {

        return new Promise((resolve, reject) => {

            this.lookup(username)

                .then(data => {

                    rp({
                        url: endPoint.statsBR(data.id),
                        headers: {
                            Authorization: "bearer " + this.access_token
                        },
                        method: "GET",
                        json: true
                    })
                        .then(stats => {
                            if (
                                fortniteTools.checkStatsPlatform(
                                    stats,
                                    platform.toLowerCase() || "pc"
                                )
                            ) {
                                resolve(data);
                            } else {
                                reject(
                                    "Impossible to fetch User. User not found on this platform"
                                );
                            }
                        })
                        .catch(() => {
                            reject("Impossible to fetch User.");
                        });

                })
                .catch(() => {
                    reject("Player Not Found");
                });
        });
    }

}

module.exports = FortniteAuth;
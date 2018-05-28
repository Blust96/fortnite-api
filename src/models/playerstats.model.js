// Mongoose importation
const mongoose = require('mongoose');

// Fortnite API connection configurations
const authConfig = require('../../config/auth.config.js');
const errorsManager = require('../../tools/errors_manager.js');
const fortniteTools = require('../../tools/fortnite_tools.js');
const FortniteAuth = require('../../tools/fortnite_auth.js');
const fortniteConnection = new FortniteAuth([
    authConfig.email,
    authConfig.password,
    authConfig.client_launcher_token,
    authConfig.fortnite_client_token
]);

// Player stats database Schema
const PlayerStatsSchema = mongoose.Schema({
    global: {
        solo: {
            wins: Number,
            top3: Number,
            top5: Number,
            top6: Number,
            top10: Number,
            top12: Number,
            top25: Number,
            kdRate: Number,
            winPercentage: Number,
            matches: Number,
            kills: Number,
            timePlayed: String,
            killsPerMatch: Number,
            killsPerMin: Number,
            score: Number
        },
        duo: {
            wins: Number,
            top3: Number,
            top5: Number,
            top6: Number,
            top10: Number,
            top12: Number,
            top25: Number,
            kdRate: Number,
            winPercentage: Number,
            matches: Number,
            kills: Number,
            timePlayed: String,
            killsPerMatch: Number,
            killsPerMin: Number,
            score: Number
        },
        squad: {
            wins: Number,
            top3: Number,
            top5: Number,
            top6: Number,
            top10: Number,
            top12: Number,
            top25: Number,
            kdRate: Number,
            winPercentage: Number,
            matches: Number,
            kills: Number,
            timePlayed: String,
            killsPerMatch: Number,
            killsPerMin: Number,
            score: Number
        },
    },
    info: {
        accountId: String,
        username: String,
        platform: String
    },
    lifetimeStats: {
        wins: Number,
        top3: Number,
        top5: Number,
        top6: Number,
        top10: Number,
        top12: Number,
        top25: Number,
        kdRate: Number,
        winPercentage: Number,
        matches: Number,
        kills: Number,
        timePlayed: String,
        killsPerMatch: Number,
        killsPerMin: Number,
        score: Number
    }
}, {
    timestamps: true
});

// TODO: Better method organization (change call order)
PlayerStatsSchema.methods.getPlayerStats = (username, platform) => {

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        if (fortniteTools.checkPlatform(platform)) {

            // Get statistics of specific player by username and platform
            PlayerStatsModel.getStats(username, platform)

                .then(result => {

                    // Check if player exists in database and has stats for specified platform
                    if (result !== false) {

                        var dbResult = result;

                        // If currentDate is greater than last updatedDate defined in checkInterval
                        if (PlayerStatsModel.checkInterval(dbResult.updatedAt, 3)) {

                            // Connection to Fortnite API
                            fortniteConnection.login()

                                .then(() => {
                                    console.log('Successfully connected to Fortnite API');

                                    // Get stats for specified player
                                    fortniteConnection.getStatsBR(username, platform)

                                        .then(result => {

                                            // Update document by id
                                            PlayerStatsModel.findByIdAndUpdate(dbResult._id, result,

                                                (err, doc) => {

                                                    if (err) {
                                                        console.log(err);
                                                        reject(errorsManager.getError(500));
                                                    }
                                                    else
                                                        resolve({
                                                            'global': doc.global,
                                                            'info': doc.info,
                                                            'lifetimeStats': doc.lifetimeStats
                                                        });

                                                });
                                        })
                                        // getStatsBR err
                                        .catch(err => {
                                            console.log(err);
                                            reject(errorsManager.getError(err));
                                        });

                                })
                                // login err
                                .catch(err => {
                                    console.log(err);
                                    reject(errorsManager.getError(err));
                                });

                        } else {
                            resolve({
                                'global': dbResult.global,
                                'info': dbResult.info,
                                'lifetimeStats': dbResult.lifetimeStats
                            });
                        }

                    } else {

                        // Connection to Fortnite API
                        fortniteConnection.login()

                            .then(() => {
                                console.log('Successfully connected to Fortnite API');

                                // Get stats for specified player
                                fortniteConnection.getStatsBR(username, platform)

                                    .then(result => {

                                        // Document creation that will be save into fortniteApi database
                                        let StatsModel = new PlayerStatsModel(result);

                                        // Add document into collection globalStats
                                        StatsModel.save((err) => {
                                            if (err) {
                                                console.log(err);
                                                reject(errorsManager.getError(err));
                                            }
                                            else
                                                resolve({
                                                    'global': result.global,
                                                    'info': result.info,
                                                    'lifetimeStats': result.lifetimeStats
                                                });
                                        });

                                    })
                                    // getStatsBR err
                                    .catch(err => {
                                        console.log(err);
                                        reject(errorsManager.getError(err));
                                    });
                            })
                            // login err
                            .catch(err => {
                                console.log(err);
                                reject(errorsManager.getError(err));
                            });

                    }

                })
                // getStats err
                .catch(err => {
                    console.log(err);
                        reject(errorsManager.getError(err));
                    });

        } else
            reject(errorsManager.getError(3));

    });

}

PlayerStatsSchema.methods.getModeStats = (username, platform, gamemode) => {

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        if (fortniteTools.checkPlatform(platform) && fortniteTools.checkGameMode(gamemode)) {

            // Get statistics of specific player by username and platform
            PlayerStatsModel.getStats(username, platform)

                .then(result => {

                    // Check if player exists in database and has stats for specified platform
                    if(result !== false) {

                        var dbResult = result;

                        // If currentDate is greater than last updatedDate defined in checkInterval
                        if(PlayerStatsModel.checkInterval(dbResult.updatedAt, 3)) {

                            fortniteConnection.login()

                                .then(() => {

                                    console.log('Successfully connected to Fortnite API');

                                    fortniteConnection.getStatsBR(username, platform)

                                        .then(result => {

                                            // Update document by id
                                            PlayerStatsModel.findByIdAndUpdate(dbResult._id, result,

                                                (err, updatedStats) => {

                                                    if(err)
                                                        reject(err);

                                                    else {

                                                        switch (gamemode) {
                                                            case 'solo':
                                                                resolve(updatedStats.global.solo);
                                                                break;
                                                            case 'duo':
                                                                resolve(updatedStats.global.duo);
                                                                break;
                                                            case 'squad':
                                                                resolve(updatedStats.global.squad);
                                                                break;
                                                            default:
                                                                reject(errorsManager.getError(3));
                                                                break;
                                                        }

                                                    }

                                                });

                                        })
                                        // getBRStats err
                                        .catch(err => {
                                            console.log(err);
                                            reject(errorsManager.getError(err));
                                        })
                                // Login err
                                }).catch(err => {
                                    console.log(err);
                                    reject(errorsManager.getError(err));
                                });

                        } else {

                            switch (gamemode) {
                                case 'solo':
                                    resolve(dbResult.global.solo);
                                    break;
                                case 'duo':
                                    resolve(dbResult.global.duo);
                                    break;
                                case 'squad':
                                    resolve(dbResult.global.squad);
                                    break;
                                default:
                                    reject(errorsManager.getError(3));
                                    break;
                            }

                        }

                    } else {

                        // Connection to Fortnite API
                        fortniteConnection.login()

                            .then(() => {
                                console.log('Successfully connected to Fortnite API');

                                // Get stats for specified player
                                fortniteConnection.getStatsBR(username, platform)

                                    .then(stats => {

                                        // Document creation that will be save into fortniteApi database
                                        let StatsModel = new PlayerStatsModel(stats);

                                        // Add document into collection globalStats
                                        StatsModel.save((err, createdStats) => {
                                            if (err) {
                                                console.log(err);
                                                reject(errorsManager.getError(err));
                                            }
                                            else
                                                switch (gamemode) {
                                                    case 'solo':
                                                        resolve(createdStats.global.solo);
                                                        break;
                                                    case 'duo':
                                                        resolve(createdStats.global.duo);
                                                        break;
                                                    case 'squad':
                                                        resolve(createdStats.global.squad);
                                                        break;
                                                    default:
                                                        reject(errorsManager.getError(3));
                                                        break;
                                                }
                                        });

                                    })
                                    // getStatsBR err
                                    .catch(err => {
                                        console.log(err);
                                        reject(errorsManager.getError(err));
                                    });
                            })
                            // login err
                            .catch(err => {
                                console.log(err);
                                reject(errorsManager.getError(err));
                            });

                    }

                })
                // getStats err
                .catch(err => {
                    console.log(err);
                    reject(errorsManager.getError(err));
                })

        } else
            reject(errorsManager.getError(3));

    });

}

PlayerStatsSchema.methods.getLeaderboard = (platform, gamemode, type) => {

    // LeaderboardModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        if(fortniteTools.checkType(type) && fortniteTools.checkGameMode(gamemode) && fortniteTools.checkPlatform(platform)) {

            PlayerStatsModel.checkLeaderboardTime(2)
                .then((greater) => {

                    // Si l'interval est supérieur
                    // if(greater) {
                    //
                    //     PlayerStatsModel.updateAllStats()
                    //         .then((updatedLeaderboard) => {
                    //
                    //         })
                    //         .catch((err) => {
                    //             reject(errorsManager.getError(err));
                    //         });
                    //
                    // } else {
                    //
                        PlayerStatsModel.getAllStats(platform, gamemode, type)
                            .then((leaderboard) => {
                                resolve(leaderboard);
                            })
                            .catch((err) => {
                               reject(errorsManager.getError(err));
                            });
                    //
                    // }

                })
                .catch((err) => {
                    reject(errorsManager.getError(err));
                })



        } else {
            reject(errorsManager.getError(3));
        }

    });

}

PlayerStatsSchema.methods.getAllStats = (platform, gamemode, type) => {

    console.log('GetAll');

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    let options = {
        'info.platform': platform,
        'global[]': gamemode
    }

    return new Promise((resolve, reject) => {

        // Get all players
        PlayerStatsModel.find(options)
            .sort(type, -1)
            .all((err, dbResult) => {

                if (err) {
                    console.log(err);
                    reject(131);
                }
                else (dbResult)
                    resolve(dbResult);

            });

        // if (err)
        //     reject(131);
        // else {
        //
        //
        //     }
        //     resolve(dbResult);
        // }

    });

}

PlayerStatsSchema.methods.updateAllStats = () => {

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        // Get all players
        PlayerStatsModel.find()
        // Update player one by one
        // Return array of all players ?

    });

}

PlayerStatsSchema.statics.checkInterval = (updatedAt, interval, type = 'minute') => {

    // Vars to compare current and updated date time
    let currentDateTime = new Date();
    let updateDateTime = new Date(updatedAt);
    // Minutes interval allowed not to reload data from API
    let greater = true;

    console.log(updateDateTime.getDate());

    // Date comparison
    switch (type) {

        case 'minute':
            // If it's same day and same hour
            if (currentDateTime.getDay() == updateDateTime.getDay() &&
                currentDateTime.getHours() == updateDateTime.getHours()) {

                // If interval is lower than the one defined
                if (currentDateTime.getMinutes() - updateDateTime.getMinutes() < interval) {
                    greater = false;
                }

            }
            break;

        case 'hour':
            console.log('hour');
            // If it's same day and same hour
            if (currentDateTime.getDay() == updateDateTime.getDay() &&
                currentDateTime.getHours() - updateDateTime.getHours() < interval) {
                console.log('greater');
                greater = false;
            }

            break;

        default:
            return 131;
            break;

    }

    return greater;

}

PlayerStatsSchema.statics.getStats = (username, platform) => {

    // Space in URI handling
    username = decodeURI(username);
    let plusPattern = '\+';
    username = username.replace(plusPattern, ' ');

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        let options = {
            'info.username': username,
            'info.platform': platform
        }

        PlayerStatsModel.findOne(options,

            (err, dbResult) => {

                if (err)
                    reject(131);
                else if (dbResult) {
                    resolve(dbResult);
                }
                else
                    resolve(false);

            });

    });

}

PlayerStatsSchema.statics.checkLeaderboardTime = (interval) => {

    console.log('checkBoardTime');

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        PlayerStatsModel.find(

            (err, dbResult) => {

                if (err)
                    reject(131);
                else if (dbResult) {

                    for (let i = 0; i < dbResult.length; i++) {
                        if(PlayerStatsModel.checkInterval(dbResult[i].updatedAt, interval, 'hour'))
                            resolve(true);
                    }

                }
                else
                    resolve(false);

            });

    });

}

// Model export
mongoose.model('PlayerStats', PlayerStatsSchema);
module.exports = mongoose.model('PlayerStats');

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
        username_lower: String,
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

                            // Updating player stats
                            PlayerStatsModel.updatePlayerStats(username, platform, dbResult._id)

                                .then((updatedStats) => {
                                    resolve(updatedStats);
                                })
                                // Updating err
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
                    if(greater) {

                        console.log('greater');

                        PlayerStatsModel.updateAllUsers()
                            .then(() => {

                                PlayerStatsModel.getAllStats(platform, gamemode, type)
                                    .then((leaderboard) => {
                                        resolve(leaderboard);
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        reject(errorsManager.getError(err));
                                    });

                            })
                            .catch((err) => {
                                reject(errorsManager.getError(err));
                            });

                    } else {

                        PlayerStatsModel.getAllStats(platform, gamemode, type)
                            .then((leaderboard) => {
                                resolve(leaderboard);
                            })
                            .catch((err) => {
                                console.log(err);
                               reject(errorsManager.getError(err));
                            });

                    }

                })
                .catch((err) => {
                    reject(errorsManager.getError(err));
                })



        } else {
            reject(errorsManager.getError(3));
        }

    });

}

PlayerStatsSchema.statics.getAllStats = (platform, gamemode, type) => {

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    // String to define what to return from database
    let dbPath, dbReturn, options;

    if(gamemode == 'all') {
        dbPath = 'lifetimeStats.' + type;
        dbReturn = dbPath + ' info -_id';
    } else {
        dbPath = 'global.' + gamemode + '.' + type;
        dbReturn = dbPath + ' info -_id';
    }

    if(platform == 'all')
        options = {};
    else
        options = {
            'info.platform': platform
        }

    return new Promise((resolve, reject) => {

        // Get all players ordered by type, where platform
        PlayerStatsModel.find(options, dbReturn)
            .sort('-' + dbPath)
            .exec((err, dbResult) => {

                if (err) {
                    reject(131);
                }
                else if (dbResult) {
                    resolve({'platform': platform,
                        'type': type,
                        'leaderboard': dbResult
                        });
                }

            });

    });

}

PlayerStatsSchema.statics.updatePlayerStats = (username, platform, id) => {

    return new Promise((resolve, reject) => {

        // PlayerStatsModel creation
        let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

        // Connection to Fortnite API
        fortniteConnection.login()

            .then(() => {
                console.log('Successfully connected to Fortnite API');

                // Get stats for specified player
                fortniteConnection.getStatsBR(username, platform)

                    .then(result => {

                        // Update document by id
                        PlayerStatsModel.findByIdAndUpdate(id, result,

                            (err, updatedStats) => {

                                if (err) {
                                    console.log(err);
                                    reject(errorsManager.getError(500));
                                }
                                else
                                    resolve({
                                        'global': updatedStats.global,
                                        'info': updatedStats.info,
                                        'lifetimeStats': updatedStats.lifetimeStats
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

    });

}

// TODO: Vérifier le retour
PlayerStatsSchema.statics.updateAllUsers = () => {

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        // Get all players
        PlayerStatsModel.find({}, 'info')
            .exec((err, dbResult) => {

                if (err) {
                    reject(131);
                }
                else if (dbResult) {
                    for (let i = 0; i < dbResult.length; i++) {
                        console.log(dbResult[i].info.username, dbResult[i].info.platform, dbResult[i]._id);
                        PlayerStatsModel.updatePlayerStats(dbResult[i].info.username, dbResult[i].info.platform, dbResult[i]._id)
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                reject(err);
                            })
                    }
                }

            });

    });

}

PlayerStatsSchema.statics.checkInterval = (updatedAt, interval, type = 'minute') => {

    // Vars to compare current and updated date time
    let currentDate = new Date();
    let updateDate = new Date(updatedAt);

    // Convert in numeric value
    let currentDateTime = currentDate.getTime();
    let updateDateTime = updateDate.getTime();

    // Minutes interval allowed not to reload data from API
    let greater = true;

    // Date comparison
    switch (type) {

        case 'minute':
            if (((currentDateTime - updateDateTime) / (1000*60) % 60) < interval) {
                greater = false;
            }
            break;

        case 'hour':
            greater = false;
            if (((currentDateTime - updateDateTime) / (1000*60*60) % 24) > interval) {
                greater = true;
            }
            break;

        default:
            return 131;
            break;

    }

    console.log(greater);
    return greater;

}

PlayerStatsSchema.statics.checkLeaderboardTime = (interval) => {

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        PlayerStatsModel.find(

            (err, dbResult) => {

                if (err)
                    reject(131);
                else if (dbResult) {

                    let needUpdate = false;

                    for (let i = 0; i < dbResult.length; i++) {
                        if(PlayerStatsModel.checkInterval(dbResult[i].updatedAt, interval, 'hour')) {
                            needUpdate = true;
                        }
                    }

                    resolve(needUpdate);

                }

            });

    });

}

PlayerStatsSchema.statics.getStats = (username, platform) => {

    // Space in URI handling
    username = decodeURI(username);
    let plusPattern = '\+';
    username = username.replace(plusPattern, ' ');

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        // Options configuration
        let options = {
            'info.username_lower': username.toLowerCase(),
            'info.platform': platform
        }

        // Find one user by username
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

// Model export
mongoose.model('PlayerStats', PlayerStatsSchema);
module.exports = mongoose.model('PlayerStats');

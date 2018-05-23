// Mongoose importation
const mongoose = require('mongoose');

// Fortnite API connection configurations
const authConfig = require('../../config/auth.config.js');
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
PlayerStatsSchema.methods.getPlayerStats = function (username, platform) {

    // PlayerStatsModel creation
    let PlayerStatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

    return new Promise((resolve, reject) => {

        if (fortniteTools.checkPlatform(platform)) {

            // Connection to Fortnite API
            fortniteConnection.login()

                .then(() => {

                    console.log('Successfully connected to Fortnite API');

                    // Get statistics of specific player by username and platform
                    PlayerStatsModel.getStats(username, platform)

                        .then(result => {

                            // Check if player exists in database and has stats for specified platform
                            if(result !== false) {

                                var dbResult = result;
                                console.log('has stats');

                                // If currentDate is greater than last updatedDate defined in checkInterval
                                if (PlayerStatsModel.checkInterval(dbResult.updatedAt)) {

                                    console.log('interval is greater');

                                    // Get stats for specified player
                                    fortniteConnection.getStatsBR(username, platform)

                                        .then(result => {

                                            // Document creation that will be save into fortniteApi database
                                            let StatsModel = new PlayerStatsModel();

                                            // Update document by id
                                            StatsModel.findByIdAndUpdate(dbResult._id, result,

                                                (err, doc) => {

                                                    if (err)
                                                        reject(err);
                                                    else
                                                        resolve(doc);

                                                });
                                        })
                                        // getStatsBR err
                                        .catch(err => {
                                            reject(err);
                                        });

                                } else {
                                    resolve(dbResult);
                                }

                            } else {

                                // Get stats for specified player
                                fortniteConnection.getStatsBR(username, platform)

                                    .then(result => {

                                        // Document creation that will be save into fortniteApi database
                                        let StatsModel = new PlayerStatsModel(result);

                                        // Add document into collection globalStats
                                        StatsModel.save((err) => {
                                            if (err)
                                                reject(err);
                                            else
                                                resolve(result);
                                        });

                                    })
                                    // getStatsBR err
                                    .catch(err => {
                                        reject(err);
                                    });

                            }

                        })
                        // getStats err
                        .catch(err => {
                            reject(err);
                        })
                    // Login err
                }).catch(err => {
                reject(err);
            });

        } else
            reject('Wrong platform');

    });

}

PlayerStatsSchema.methods.getModeStats = function (username, platform, gamemode) {

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
                        if(PlayerStatsModel.checkInterval(dbResult.updatedAt)) {

                            fortniteConnection.login()

                                .then(() => {

                                    console.log('Successfully connected to Fortnite API');

                                    fortniteConnection.getStatsBR(username, platform)

                                        .then(result => {

                                            // Document creation that will be save into fortniteApi database
                                            let StatsModel = new PlayerStatsModel();

                                            // Update document by id
                                            StatsModel.findByIdAndUpdate(dbResult._id, result,

                                                (err, doc) => {

                                                    if(err)
                                                        reject(err);

                                                    else {

                                                        switch (gamemode) {
                                                            case 'solo':
                                                                resolve(doc.global.solo);
                                                            case 'duo':
                                                                resolve(doc.global.duo);
                                                            case 'squad':
                                                                resolve(doc.global.squad);
                                                            default:
                                                                reject('Wrong game mode');
                                                        }

                                                    }

                                                });

                                        })
                                        // getBRStats err
                                        .catch(err => {
                                            reject(err);
                                        })
                                // Login err
                                }).catch(err => {
                                    reject(err);
                                });

                        } else {

                            switch (gamemode) {
                                case 'solo':
                                    resolve(dbResult.global.solo);
                                case 'duo':
                                    resolve(dbResult.global.duo);
                                case 'squad':
                                    resolve(dbResult.global.squad);
                                default:
                                    reject('Wrong game mode');
                            }

                        }

                    }

                })
                // getStats err
                .catch(err => {
                    reject(err);
                })

        } else
            reject('Wrong platform or gamemode');

    });

}

PlayerStatsSchema.statics.checkInterval = (updatedAt) => {

    // Vars to compare current and updated date time
    let currentDateTime = new Date();
    let updateDateTime = new Date(updatedAt);
    // Minutes interval allowed not to reload data from API
    let minutesInterval = 3;

    // Date comparison
    // If it's same day and same hour
    if (currentDateTime.getDay() == updateDateTime.getDay() &&
        currentDateTime.getHours() == updateDateTime.getHours()) {

        // If interval is lower than the one defined
        if (!(currentDateTime.getMinutes() - updateDateTime.getMinutes() < minutesInterval)) {
            return true;
        } else
            return false;

    } else
        return false;

}

PlayerStatsSchema.statics.getStats = (username, platform) => {

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
                    reject(err);
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

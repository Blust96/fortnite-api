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

PlayerStatsSchema.methods.getPlayerStats = function (username, platform) {

    return new Promise((resolve, reject) => {

        if (fortniteTools.checkPlatform(platform)) {

            fortniteConnection.login()

                .then(() => {

                    console.log('Successfully connected to Fortnite API');

                    fortniteConnection.getStatsBR(username, platform)

                        .then(result => {
                            let StatsModel = mongoose.model('PlayerStats', PlayerStatsSchema);
                            let allStats = new StatsModel(result);
                            allStats.save(function (err) {
                                if (err)
                                    console.log(err);
                            });
                            console.log(result);
                            resolve(result);
                        })
                        .catch(err => {
                            reject(err);
                        })

                }).catch(err => {
                console.log('Could not connect Fortnite API. Exiting now...');
                reject(err);

            });

        }

    });

}

PlayerStatsSchema.methods.getModeStats = function (username, platform, gamemode) {

    return new Promise((resolve, reject) => {

        if (fortniteTools.checkPlatform(platform) && fortniteTools.checkGameMode(gamemode)) {

            fortniteConnection.login()

                .then(() => {

                    console.log('Successfully connected to Fortnite API');

                    fortniteConnection.getStatsBR(username, platform)

                        .then(result => {
                            resolve(result);
                        })
                        .catch(err => {
                            reject(err);
                        })

                }).catch(err => {
                console.log('Could not connect Fortnite API. Exiting now...');
                reject(err);

            });

        }

    });

}

mongoose.model('PlayerStats', PlayerStatsSchema);
module.exports = mongoose.model('PlayerStats');

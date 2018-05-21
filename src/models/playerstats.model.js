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

// TODO: Check if stats already exists for this player, then create or update like getGameModes
PlayerStatsSchema.methods.getPlayerStats = function (username, platform) {

    return new Promise((resolve, reject) => {

        if (fortniteTools.checkPlatform(platform)) {

            fortniteConnection.login()

                .then(() => {

                    console.log('Successfully connected to Fortnite API');

                    fortniteConnection.getStatsBR(username, platform)

                        .then(result => {

                            // Document creation that will be save into fortniteApi database
                            let StatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');
                            let allStats = new StatsModel(result);

                            // Add document into collection globalStats
                            allStats.save((err) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(result);
                            });

                        })
                        .catch(err => {
                            reject(err);
                        })

                }).catch(err => {
                console.log('Could not connect Fortnite API. Exiting now...');
                reject(err);

            });

        } else
            reject('Wrong platform or gamemode');

    });

}

// TODO: Check date comparison, and update post
PlayerStatsSchema.methods.getModeStats = function (username, platform, gamemode) {

    return new Promise((resolve, reject) => {

        if (fortniteTools.checkPlatform(platform) && fortniteTools.checkGameMode(gamemode)) {

            // Document creation that will be use to check datas
            let StatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');

            // Check if player exists in database and has stats for specified platform
            StatsModel.
                findOne({
                    'info.username': username,
                    'info.platform': platform
                }, 'global updatedAt _id', (err, dbResult) => {
                    if (err) {
                        reject(err);
                    }
                    else {

                        // Vars to compare current and updated date time
                        let currentDateTime = new Date();
                        let updateDateTime = new Date(dbResult.updatedAt);
                        let crawlApi = false;

                        // Date comparison
                        // If it's same day and same hour
                        if(currentDateTime.getDay() == updateDateTime.getDay() &&
                            currentDateTime.getHours() == updateDateTime.getHours()) {

                            // If interval is lower than 10 minutes
                            if(currentDateTime.getMinutes() - updateDateTime.getMinutes() < 10) {
                                console.log('Resolve from database');
                                resolve(dbResult);
                            }  else {
                                crawlApi = true;
                            }

                        } else {
                            crawlApi = true;
                        }

                        // If interval is bigger than 10 minutes then get stats from Fortnite API
                        if(crawlApi) {

                            console.log('Crawl API');

                            fortniteConnection.login()

                                .then(() => {

                                    console.log('Successfully connected to Fortnite API');

                                    fortniteConnection.getStatsBR(username, platform)

                                        .then(result => {

                                            // Document creation that will be save into fortniteApi database
                                            let StatsModel = mongoose.model('PlayerStats', PlayerStatsSchema, 'globalStats');
                                            let allStats = new StatsModel(result);

                                            // Update document by id
                                            allStats.update({_id: dbResult._id },
                                                            result,
                                                            (err) => {
                                                                if (err)
                                                                    reject(err);
                                                                else
                                                                    resolve(result);
                                                            });

                                        })
                                        .catch(err => {
                                            reject(err);
                                        })

                                }).catch(err => {
                                console.log('Could not connect Fortnite API. Exiting now...');
                                reject(err);

                            });

                        }

                    }

                });

        } else
            reject('Wrong platform or gamemode');

    });

}

mongoose.model('PlayerStats', PlayerStatsSchema);
module.exports = mongoose.model('PlayerStats');

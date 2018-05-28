// Mongoose importation
const mongoose = require('mongoose');

// Player Stats model importation
const PlayerStatsModel = require('./playerstats.model.js');

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

// Leaderboard database Schema
const PlayerSchema = mongoose.Schema({

    player: {
        accountId: String,
        value: Number,
        rank: Number,
        displayName: String
    }
}, {
    timestamps: true
});

const LeaderboardSchema = mongoose.Schema({
    leaderboard: [PlayerSchema]
}, {
    timestamps: true
});

// TODO:
// 1) Update leader
// 2) Create query to get leaderboard depends on platform and gamemode parameters, ordered by type

LeaderboardSchema.methods.getLeaderboard = (platform, gamemode, type) => {

    // LeaderboardModel creation
    let LeaderboardModel = mongoose.model('Leaderboard', LeaderboardSchema, 'leaderboard');

    return new Promise((resolve, reject) => {

        if(fortniteTools.checkType(type) && fortniteTools.checkGameMode(gamemode) && fortniteTools.checkPlatform(platform)) {
            resolve({
                'platform': platform,
                'gamemode': gamemode,
                'type': type
            });
        } else {
            reject(errorsManager.getError(3));
        }

    });

}

LeaderboardSchema.static.updateLeaderboard = () => {

    const playerStats = new PlayerStatsModel();

}

// Model export
mongoose.model('Leaderboard', LeaderboardSchema);
module.exports = mongoose.model('Leaderboard');
const PlayerStatsModel = require('../models/playerstats.model.js');
const playerStats = new PlayerStatsModel();

// Returns all stats of a player
exports.getPlayerStats = (req, res) => {

    // Get url parameters
    let platform = req.params.platform;
    let username = req.params.username;

    // Promise execution
    playerStats.getPlayerStats(username, platform)
        .then(result => {
            return res.send(result);
        })
        .catch(err => {
            return res.send(err);
        })

}

// Returns gamemode stats of a player
exports.getModeStats = (req, res) => {

    // Get url parameters
    let platform = req.params.platform;
    let username = req.params.username;
    let gamemode = req.params.gamemode;

}

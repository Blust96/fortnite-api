const PlayerStatsModel = require('../models/playerstats.model.js');
const playerStats = new PlayerStatsModel();

// Returns all stats of a player
exports.getPlayerStats = (req, res) => {

    // Get url parameters
    let platform = req.params.platform.toLowerCase();
    let username = req.params.username;
    let gamemode = req.params.gamemode;

    if(!gamemode) {
        // Promise execution
        playerStats.getPlayerStats(username, platform)
            .then(result => {
                res.type('application/json');
                return res.status(200).send(result);
            })
            .catch(err => {
                res.type('application/json');
                return res.status(err.httpCode).send({
                    'error': err.error
                });
            });
    } else {
        gamemode.toLowerCase();
        // Promise execution
        playerStats.getModeStats(username, platform, gamemode)
            .then(result => {
                res.type('application/json');
                return res.status(200).send(result);
            })
            .catch(err => {
                res.type('application/json');
                return res.status(err.httpCode).send({
                    'error': err.error
                });
            });
    }

}

// returns leaderboard, can be group by mode plus/or platform
exports.getLeaderBoard = (req, res) => {

    // Get url parameters
    let gamemode = req.params.gamemode.toLowerCase();
    let platform = req.params.platform.toLowerCase();
    let type = req.params.type.toLowerCase();

    playerStats.getLeaderboard(platform, gamemode, type)
        .then(result => {
            res.type('application/json');
            return res.status(200).send(result);
        })
        .catch(err => {
            res.type('application/json');
            return res.status(err.httpCode).send({
                'error': err.error
            });
        });

}

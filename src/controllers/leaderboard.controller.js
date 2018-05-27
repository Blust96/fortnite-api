const LeaderboardModel = require('../models/leaderboard.model.js');
const Leaderboard = new LeaderboardModel();

// returns leaderboard, can be group by mode plus/or platform
exports.getLeaderBoard = (req, res) => {

    // Get url parameters
    let gamemode = req.params.gamemode;
    let platform = req.params.platform;
    let type = req.params.type;

    Leaderboard.getLeaderboard(platform, gamemode, type)
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
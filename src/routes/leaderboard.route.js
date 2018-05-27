module.exports = (app) => {

    const leaderboardController = require('../controllers/leaderboard.controller.js');

    // Route to get leaderboard, can be group by mode plus/or platform
    app.get('/leaderboard/:platform/:gamemode/:type', leaderboardController.getLeaderBoard);

}
module.exports = (app) => {

    const playerStatsController = require('../controllers/playerstats.controller.js');

    // Route to get all player stats for a platform, by game mode if specified
    app.get('/stats/:platform/:username/:gamemode?', playerStatsController.getPlayerStats);

    // Route to get leaderboard, can be group by mode plus/or platform
    app.get('/leaderboard/:platform/:gamemode/:type', playerStatsController.getLeaderBoard);

}

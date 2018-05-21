module.exports = (app) => {

    const playerStatsController = require('../controllers/playerstats.controller.js');

    // Route to get all player stats
    app.get('/stats/:platform/:username', playerStatsController.getPlayerStats);

    // Route to get specified game mode stats
    app.get('/stats/:platform/:username/:gamemode', playerStatsController.getModeStats);

}

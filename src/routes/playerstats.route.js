module.exports = (app) => {

    const playerStats = require('../controllers/playerstats.controller.js');

    // Test
    app.get('/', playerStats.displayTest);

}

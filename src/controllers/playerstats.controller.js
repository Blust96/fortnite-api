const PlayerStats = require('../models/playerstats.model.js');

exports.displayTest = (req, res) => {
    PlayerStats.test();
    return res.send('test');
}

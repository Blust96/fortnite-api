const PlayerStats = require('../models/playerstats.model.js');

exports.test = (req, res) => {
  PlayerStats.test();
  return res.send('test');
}

const mongoose = require('mongoose');

const PlayerStatsSchema = mongoose.Schema({
  global: {
    solo: {
      wins: Number,
      top3: Number,
      top5: Number,
      top6: Number,
      top10: Number,
      top12: Number,
      top25: Number,
      matches: Number,
      kills: Number,
      timePlayed: String,
      score: Number
    },
    duo: {
      wins: Number,
      top3: Number,
      top5: Number,
      top6: Number,
      top10: Number,
      top12: Number,
      top25: Number,
      matches: Number,
      kills: Number,
      timePlayed: String,
      score: Number
    },
    squad: {
      wins: Number,
      top3: Number,
      top5: Number,
      top6: Number,
      top10: Number,
      top12: Number,
      top25: Number,
      matches: Number,
      kills: Number,
      timePlayed: String,
      score: Number
    },
  },
  info: {
    accountId: String,
    username: String,
    platform: String
  },
  lifetimeStats: {
    wins: Number,
    top3: Number,
    top5: Number,
    top6: Number,
    top10: Number,
    top12: Number,
    top25: Number,
    matches: Number,
    kills: Number,
    timePlayed: String,
    score: Number
  }
}, {
    timestamps: true
});

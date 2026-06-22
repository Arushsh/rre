const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  img: { type: String, required: true },
  insta: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);

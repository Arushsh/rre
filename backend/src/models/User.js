const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  password: { type: String },
  selfieUrl: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  myEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' }],
  favorites: [{ type: String }], // Array of photo URLs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

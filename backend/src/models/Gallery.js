const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  eventDate: { type: Date, default: Date.now },
  location: { type: String },
  photographer: { type: String },
  password: { type: String, required: true },
  coverImage: { type: String },
  media: [{
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true },
    thumbnail: { type: String }
  }],
  qrCode: { type: String },
  revenue: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: false },
  downloads: { type: Number, default: 0 },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true,
    enum: ['photography', 'videography', 'audio', 'production', 'live']
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String },
  features: [{ type: String }],
  icon: { type: String }, // Icon name from lucide-react
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);

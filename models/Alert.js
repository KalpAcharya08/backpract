const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  indicator: {
    type: String,
    required: true,
    enum: ['PRICE', 'SMA', 'EMA', 'RSI', 'MACD', 'VOLUME']
  },
  condition: {
    type: String,
    required: true,
    enum: ['above', 'below', 'crosses_above', 'crosses_below']
  },
  value: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  lastTriggered: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster querying
AlertSchema.index({ user: 1, symbol: 1, active: 1 });

module.exports = mongoose.model('Alert', AlertSchema);
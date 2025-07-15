const mongoose = require('mongoose');

const StockDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  close: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  interval: {
    type: String,
    required: true,
    enum: ['1min', '5min', '15min', '30min', '60min', 'daily'],
    index: true
  }
}, {
  timestamps: true
});

// Compound index for unique data points
StockDataSchema.index({ symbol: 1, timestamp: 1, interval: 1 }, { unique: true });

// Add TTL index for automatic data expiration (optional)
// StockDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // 30 days

module.exports = mongoose.model('StockData', StockDataSchema);
const TelegramBot = require('node-telegram-bot-api');
const Alert = require('../models/Alert');
const StockData = require('../models/StockData');
const TechnicalIndicators = require('./technicalIndicators');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = TELEGRAM_TOKEN ? new TelegramBot(TELEGRAM_TOKEN, { polling: true }) : null;

const checkAlerts = async () => {
  try {
    const alerts = await Alert.find({ active: true }).populate('user');
    if (alerts.length === 0) return;

    // Get latest stock data for all symbols with alerts
    const symbols = [...new Set(alerts.map(alert => alert.symbol))];
    const latestData = {};

    for (const symbol of symbols) {
      const data = await StockData.find({ symbol })
        .sort({ timestamp: -1 })
        .limit(100);
      
      // Calculate indicators
      let processedData = [...data].reverse();
      
      // Calculate all possible indicators
      processedData = TechnicalIndicators.calculateSMA(processedData, 20);
      processedData = TechnicalIndicators.calculateEMA(processedData, 20);
      processedData = TechnicalIndicators.calculateRSI(processedData);
      processedData = TechnicalIndicators.calculateMACD(processedData);
      
      latestData[symbol] = processedData[processedData.length - 1];
    }

    // Check each alert
    for (const alert of alerts) {
      const stock = latestData[alert.symbol];
      if (!stock) continue;

      let shouldTrigger = false;
      const currentValue = stock[alert.indicator.toLowerCase()] || stock.close;

      switch (alert.condition) {
        case 'above':
          shouldTrigger = currentValue > alert.value;
          break;
        case 'below':
          shouldTrigger = currentValue < alert.value;
          break;
        case 'crosses_above':
          // Need to implement cross detection (compare with previous value)
          break;
        case 'crosses_below':
          // Need to implement cross detection (compare with previous value)
          break;
      }

      if (shouldTrigger) {
        await sendAlert(alert, stock);
        alert.lastTriggered = new Date();
        await alert.save();
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};

const sendAlert = async (alert, stockData) => {
  const message = `🚨 Alert Triggered 🚨
  Stock: ${alert.symbol}
  Condition: ${alert.indicator} ${alert.condition} ${alert.value}
  Current Value: ${stockData[alert.indicator.toLowerCase()] || stockData.close}
  Time: ${new Date().toLocaleString()}`;

  if (alert.user.telegramChatId && bot) {
    try {
      await bot.sendMessage(alert.user.telegramChatId, message);
    } catch (error) {
      console.error('Error sending Telegram alert:', error);
    }
  }

  // TODO: Implement email alerts
};

// Check alerts every minute
setInterval(checkAlerts, 60 * 1000);

module.exports = {
  checkAlerts,
  bot
};
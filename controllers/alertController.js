const Alert = require('../models/Alert');
const { bot } = require('../services/alertService');

// Create a new alert
const createAlert = async (req, res) => {
  try {
    const { symbol, indicator, condition, value } = req.body;
    const userId = req.user.id;

    const newAlert = new Alert({
      user: userId,
      symbol,
      indicator,
      condition,
      value,
      active: true
    });

    await newAlert.save();

    res.status(201).json({
      success: true,
      data: newAlert
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get all alerts for a user
const getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id });
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Update an alert
const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, ...updateData } = req.body;

    const alert = await Alert.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Delete an alert
const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Telegram bot webhook setup
const setupTelegramWebhook = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user.id;

    // Update user with Telegram chat ID
    req.user.telegramChatId = chatId;
    await req.user.save();

    if (bot) {
      await bot.sendMessage(
        chatId,
        '✅ Success! You will now receive stock alerts here.'
      );
    }

    res.json({
      success: true,
      message: 'Telegram notifications enabled'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error setting up Telegram notifications'
    });
  }
};

module.exports = {
  createAlert,
  getUserAlerts,
  updateAlert,
  deleteAlert,
  setupTelegramWebhook
};
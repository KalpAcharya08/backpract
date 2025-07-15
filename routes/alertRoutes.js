const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAlert,
  getUserAlerts,
  updateAlert,
  deleteAlert,
  setupTelegramWebhook
} = require('../controllers/alertController');

// Protected routes (require authentication)
router.use(protect);

router.route('/')
  .post(createAlert)
  .get(getUserAlerts);

router.route('/:id')
  .put(updateAlert)
  .delete(deleteAlert);

router.post('/telegram', setupTelegramWebhook);

module.exports = router;
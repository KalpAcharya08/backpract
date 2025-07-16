const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

router.get('/predict', predictionController.getPrediction);

module.exports = router;
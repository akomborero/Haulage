const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// The main dashboard endpoint
router.get('/summary', reportController.getDailySummary);

module.exports = router;
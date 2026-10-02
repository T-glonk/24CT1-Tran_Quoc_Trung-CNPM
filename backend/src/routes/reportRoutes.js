const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/summary', reportController.getSummary);
router.get('/logs', reportController.getActivityLogs);

module.exports = router;

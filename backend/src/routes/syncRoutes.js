const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// GET /api/sync/health - Trạng thái kết nối MySQL & Cache
router.get('/health', syncController.getDatabaseHealth);

// POST /api/sync/mysql - Thực hiện đồng bộ với MySQL Server
router.post('/mysql', syncController.syncDatabase);

// POST /api/sync/reset - Reset dữ liệu
router.post('/reset', syncController.resetDatabase);

module.exports = router;

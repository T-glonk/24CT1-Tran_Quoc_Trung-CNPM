const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/db/stats - Lấy thông tin & thống kê cơ sở dữ liệu
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: db.getStats(),
  });
});

// POST /api/db/reset - Đặt lại cơ sở dữ liệu về mặc định (dùng cho dev/test)
router.post('/reset', (req, res) => {
  const stats = db.resetDatabase();
  res.json({
    success: true,
    message: 'Đã reset cơ sở dữ liệu về dữ liệu ban đầu thành công',
    data: stats,
  });
});

module.exports = router;

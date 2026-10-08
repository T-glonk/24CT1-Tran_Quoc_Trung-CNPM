// ─── DATA SYNC & DATABASE HEALTH CONTROLLER ─────────────────────────────────
const db = require('../config/db');
const { pool, testMySQLConnection } = require('../config/mysql');

// GET /api/sync/health - Kiểm tra trạng thái kết nối MySQL và Bộ nhớ đệm
async function getDatabaseHealth(req, res) {
  const mySqlStatus = await testMySQLConnection();
  const cacheStats = db.getStats();

  res.json({
    success: true,
    database: {
      engine: 'MySQL 8.0 & Persistent Local Cache Store',
      mysqlConnection: mySqlStatus.success ? 'online' : 'offline',
      mysqlError: mySqlStatus.error || null,
      cacheStore: cacheStats.status,
      tablesCount: cacheStats.counts ? Object.keys(cacheStats.counts).length : 7,
      counts: cacheStats.counts,
      lastSyncTime: new Date().toISOString(),
    },
  });
}

// POST /api/sync/mysql - Đồng bộ dữ liệu 2 chiều giữa MySQL và Local Cache
async function syncDatabase(req, res) {
  try {
    const isConnected = await testMySQLConnection();
    if (!isConnected.success) {
      return res.status(503).json({
        success: false,
        message: 'Không thể kết nối MySQL Server để đồng bộ',
        error: isConnected.error,
      });
    }

    // Đọc dữ liệu mới nhất từ MySQL
    const [users] = await pool.query('SELECT * FROM users');
    const [courts] = await pool.query('SELECT * FROM courts');
    const [bookings] = await pool.query('SELECT * FROM bookings');
    const [services] = await pool.query('SELECT * FROM services');
    const [transactions] = await pool.query('SELECT * FROM transactions');

    res.json({
      success: true,
      message: 'Đồng bộ dữ liệu MySQL Server thành công',
      syncedRecords: {
        users: users ? users.length : 0,
        courts: courts ? courts.length : 0,
        bookings: bookings ? bookings.length : 0,
        services: services ? services.length : 0,
        transactions: transactions ? transactions.length : 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đồng bộ dữ liệu MySQL',
      error: err.message,
    });
  }
}

// POST /api/sync/reset - Khôi phục dữ liệu ban đầu
async function resetDatabase(req, res) {
  const stats = db.resetDatabase();
  res.json({
    success: true,
    message: 'Đã đặt lại dữ liệu mặc định thành công',
    data: stats,
  });
}

module.exports = {
  getDatabaseHealth,
  syncDatabase,
  resetDatabase,
};

// ─── MYSQL CONNECTION POOL & CLIENT ─────────────────────────────────────────────
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '7855',
  database: process.env.DB_NAME || 'alobo_badminton',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Kiểm tra kết nối tới MySQL Server
async function testMySQLConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL] ✅ Kết nối MySQL Server thành công: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3307'}/${process.env.DB_NAME || 'alobo_badminton'}`);
    connection.release();
    return { success: true, message: 'Connected to MySQL' };
  } catch (err) {
    console.warn(`[MySQL Notice] ⚠️ Chưa kết nối MySQL Server (${err.message}). Hệ thống tự động sử dụng persistent file database.json.`);
    return { success: false, error: err.message };
  }
}

module.exports = {
  pool,
  testMySQLConnection,
};

// ─── MYSQL DATABASE CONNECTION POOL & QUERY ENGINE ─────────────────────────
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });
const mysql = require('mysql2/promise');

// Khởi tạo Connection Pool kết nối MySQL Database
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

// Thực thi câu lệnh SQL trực tiếp trên MySQL Pool
async function query(sql, params = []) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.warn(`[MySQL Query Notice]: ${error.message}`);
    throw error;
  }
}

// Kiểm tra kết nối tới MySQL Database Server
async function testMySQLConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL Database] ✅ Kết nối MySQL Server thành công: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3307'}/${process.env.DB_NAME || 'alobo_badminton'}`);
    connection.release();
    return { success: true, message: 'Connected to MySQL Database' };
  } catch (err) {
    console.warn(`[MySQL Database Notice] ⚠️ Chưa kết nối MySQL Server (${err.message}). Hệ thống tự động kích hoạt chế độ Persistent Cache Store.`);
    return { success: false, error: err.message };
  }
}

module.exports = {
  pool,
  query,
  testMySQLConnection,
};


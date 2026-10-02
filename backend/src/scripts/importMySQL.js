// ─── AUTO IMPORT MYSQL DATABASE SCRIPT ───────────────────────────────────────────
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function importDatabase() {
  console.log('=====================================================');
  console.log('🏸 ĐANG KHỞI TẠO & IMPORT CƠ SỞ DỮ LIỆU MYSQL...');
  console.log(`📡 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3307'}`);
  console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
  console.log('=====================================================');

  let connection;
  try {
    // 1. Kết nối không chọn database để tạo database trước
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3307', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '7855',
      multipleStatements: true,
    });

    const sqlPath = path.join(__dirname, '../data/alobo_badminton_mysql.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Đang thực thi tệp alobo_badminton_mysql.sql...');
    await connection.query(sqlContent);

    console.log('✅ ĐÃ TẠO DATABASE `alobo_badminton` VÀ 8 BẢNG QUAN HỆ THÀNH CÔNG TRÊN MYSQL!');
    console.log('🎉 Toàn bộ dữ liệu mẫu đã được nạp vào MySQL Workbench.');
    console.log('=====================================================\n');
  } catch (err) {
    console.error('❌ Lỗi khi import vào MySQL:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

importDatabase();

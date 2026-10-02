// ─── DATABASE INITIALIZATION & VERIFICATION SCRIPT ─────────────────────────────
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

function main() {
  console.log('=====================================================');
  console.log('🏸 ALOBO BADMINTON DATABASE INITIALIZATION');
  console.log('=====================================================');

  const args = process.argv.slice(2);
  const isReset = args.includes('--reset');

  if (isReset) {
    console.log('🔄 Đang thiết lập lại toàn bộ dữ liệu mẫu (Reset Database)...');
    db.resetDatabase();
    console.log('✅ Đã reset cơ sở dữ liệu về trạng thái ban đầu thành công!');
  }

  const stats = db.getStats();
  console.log('\n📊 THỐNG KÊ DỮ LIỆU HIỆN TẠI:');
  console.log(`- Vị trí tệp: ${stats.filePath}`);
  console.log(`- 👥 Người dùng (Users):        ${stats.counts.users}`);
  console.log(`- 🏟️ Câu lạc bộ (Clubs):        ${stats.counts.clubs}`);
  console.log(`- 🏸 Sân thi đấu (Courts):      ${stats.counts.courts}`);
  console.log(`- 📋 Đơn đặt sân (Bookings):    ${stats.counts.bookings}`);
  console.log(`- 🛍️ Dịch vụ / POS (Services):  ${stats.counts.services}`);
  console.log(`- 💳 Giao dịch (Transactions):  ${stats.counts.transactions}`);
  console.log(`- 📜 Nhật ký (Activity Logs):   ${stats.counts.logs}`);
  console.log('\n🎉 Cơ sở dữ liệu sẵn sàng hoạt động cùng Backend và Frontend App!');
  console.log('=====================================================\n');
}

main();

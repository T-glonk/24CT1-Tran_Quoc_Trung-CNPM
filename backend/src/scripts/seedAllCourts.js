const fs = require('fs');
const path = require('path');
const { pool } = require('../config/mysql');

const dbPath = path.join(__dirname, '../data/database.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const CLUBS_CONFIG = [
  {
    id: 'c1',
    name: 'QT Sport - Cơ sở 1: Sân Hoa Thiên Lý',
    location: '207 Quách Thị Trang, Hòa Xuân, Cẩm Lệ, Đà Nẵng',
    district: 'Cẩm Lệ',
    totalCourts: 8,
    basePrice: 80000,
    type: 'Thảm Yonex Tiêu chuẩn BWF',
  },
  {
    id: 'c2',
    name: 'QT Sport - Cơ sở 2: Sân Kỳ Đồng',
    location: '93 Kỳ Đồng, Thanh Khê Đông, Thanh Khê, Đà Nẵng',
    district: 'Thanh Khê',
    totalCourts: 6,
    basePrice: 60000,
    type: 'Thảm PVC Chống Trơn',
  },
  {
    id: 'c3',
    name: 'QT Sport - Cơ sở 3: Sân Sơn Trà Pro',
    location: '120 Ngô Quyền, An Hải Bắc, Sơn Trà, Đà Nẵng',
    district: 'Sơn Trà',
    totalCourts: 6,
    basePrice: 90000,
    type: 'Thảm Yonex Đèn Chống Lóa',
  },
  {
    id: 'c4',
    name: 'QT Sport - Cơ sở 4: ECO Badminton Center',
    location: '45 Huỳnh Tấn Phát, Tân Thuận Đông, Quận 7, TP.HCM',
    district: 'Quận 7',
    totalCourts: 8,
    basePrice: 95000,
    type: 'Thảm Victor Master Pro',
  },
  {
    id: 'c5',
    name: 'QT Sport - Cơ sở 5: Sky Badminton Club',
    location: '18D Cộng Hòa, Phường 4, Tân Bình, TP.HCM',
    district: 'Tân Bình',
    totalCourts: 6,
    basePrice: 85000,
    type: 'Thảm Enlio Quốc Tế',
  },
  {
    id: 'c6',
    name: 'QT Sport - Cơ sở 6: CLB Hoàng Văn Thụ',
    location: '20 Hoàng Minh Giám, Phường 9, Phú Nhuận, TP.HCM',
    district: 'Phú Nhuận',
    totalCourts: 6,
    basePrice: 80000,
    type: 'Thảm Yonex Trần Cao 11m',
  },
  {
    id: 'c7',
    name: 'QT Sport - Cơ sở 7: Gia Hân Badminton Arena',
    location: '38 Chế Lan Viên, Tây Thạnh, Tân Phú, TP.HCM',
    district: 'Tân Phú',
    totalCourts: 6,
    basePrice: 75000,
    type: 'Thảm Đỏ VIP Arena',
  },
  {
    id: 'c8',
    name: 'QT Sport - Cơ sở 8: Hồng Châu Sport Club',
    location: '56 Phan Đăng Lưu, Phường 5, Bình Thạnh, TP.HCM',
    district: 'Bình Thạnh',
    totalCourts: 6,
    basePrice: 85000,
    type: 'Thảm Yonex Chính Hãng',
  },
];

const allCourts = [];

CLUBS_CONFIG.forEach((club) => {
  for (let i = 1; i <= club.totalCourts; i++) {
    // For c1, use ids "1".."8" for compatibility with existing bookings
    const courtId = club.id === 'c1' ? String(i) : `${club.id}_${i}`;
    const isVip = i === 5 && (club.id === 'c1' || club.id === 'c4');
    const isMaintenance = i === 8 && club.id === 'c1';
    const isInUse = i === 3 && club.id === 'c1';

    const courtName = isVip ? `Sân ${i} (VIP)` : `Sân ${i}`;
    const courtPrice = isVip ? club.basePrice + 40000 : club.basePrice;
    const courtType = isVip ? 'Thảm Victor Pro VIP Khán Đài' : club.type;
    const status = isMaintenance ? 'maintenance' : isInUse ? 'in_use' : 'available';

    allCourts.push({
      id: courtId,
      clubId: club.id,
      name: courtName,
      clubName: club.name,
      location: club.location,
      district: club.district,
      price: courtPrice,
      type: courtType,
      status: status,
      currentGuest: isMaintenance
        ? 'Bảo trì hệ thống đèn LED'
        : isInUse
        ? 'Nguyễn Văn An (0912345678)'
        : null,
      currentSlot: isInUse ? '18:00 - 20:00' : isMaintenance ? 'Tạm ngừng ca ngày' : null,
      image:
        club.id === 'c1'
          ? 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'
          : club.id === 'c2'
          ? 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80'
          : 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=400&q=80',
    });
  }
});

console.log(`Generated ${allCourts.length} courts across ${CLUBS_CONFIG.length} facilities.`);

// Update database.json
dbData.courts = allCourts;
if (dbData.meta && dbData.meta.recordsCount) {
  dbData.meta.recordsCount.courts = allCourts.length;
}
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('Saved to database.json');

// Sync to MySQL
async function syncMySQL() {
  try {
    for (const c of allCourts) {
      await pool.query(
        `INSERT INTO courts (id, club_id, name, type, price, status, current_guest, current_slot, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           club_id = VALUES(club_id),
           name = VALUES(name),
           type = VALUES(type),
           price = VALUES(price),
           status = VALUES(status),
           current_guest = VALUES(current_guest),
           current_slot = VALUES(current_slot),
           image = VALUES(image)`,
        [
          c.id,
          c.clubId,
          c.name,
          c.type,
          c.price,
          c.status,
          c.currentGuest,
          c.currentSlot,
          c.image,
        ]
      );
    }
    console.log('Synced all courts to MySQL database!');
  } catch (err) {
    console.error('MySQL sync error:', err.message);
  }
  process.exit(0);
}

syncMySQL();

// ─── COURT CONTROLLER ────────────────────────────────────────────────────────
const db = require('../config/db');
const { pool } = require('../config/mysql');

// GET /api/courts
function getAllCourts(req, res) {
  const courts = db.getCourts();
  res.json({
    success: true,
    count: courts.length,
    data: courts,
  });
}

// GET /api/courts/:id
function getCourtById(req, res) {
  const court = db.getCourtById(req.params.id);
  if (!court) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sân' });
  }
  res.json({ success: true, data: court });
}

// PATCH /api/courts/:id/status
function updateCourtStatus(req, res) {
  const { id } = req.params;
  const { status, currentGuest, currentSlot } = req.body;

  const validStatuses = ['available', 'booked', 'in_use', 'maintenance'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái sân không hợp lệ' });
  }

  const updated = db.updateCourt(id, {
    status,
    currentGuest: status === 'in_use' ? (currentGuest || 'Khách đang thi đấu') : status === 'maintenance' ? (currentGuest || 'Đang bảo dưỡng') : null,
    currentSlot: status === 'in_use' ? (currentSlot || 'Hiện tại') : null,
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sân cần cập nhật' });
  }

  // Sync to MySQL
  pool.query('UPDATE courts SET status = ? WHERE id = ?', [status, id]).catch(() => {});

  // Audit log
  db.addLog({
    action: 'Cập nhật trạng thái sân',
    detail: `Sân "${updated.name}" đổi trạng thái thành ${status}`,
    user: req.user ? req.user.name : 'Quản lý',
    type: 'court',
  });

  res.json({
    success: true,
    message: 'Cập nhật trạng thái sân thành công',
    data: updated,
  });
}

// POST /api/courts
function addCourt(req, res) {
  const { name, clubId, clubName, location, district, price, type } = req.body;
  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên sân và giá thuê' });
  }

  const newCourt = db.addCourt({
    name,
    clubId: clubId || 'c1',
    clubName: clubName || 'CLB Cầu Lông TPT Sport',
    location: location || '207 Quách Thị Trang, Hòa Xuân, Cẩm Lệ, Đà Nẵng',
    district: district || 'Cẩm Lệ',
    price: Number(price),
    type: type || 'Thảm PVC thi đấu',
  });

  // Sync to MySQL
  pool.query(
    'INSERT INTO courts (id, club_id, name, type, price, status) VALUES (?, ?, ?, ?, ?, ?)',
    [
      newCourt.id,
      newCourt.clubId || 'c1',
      newCourt.name,
      newCourt.type || 'Thảm PVC thi đấu',
      newCourt.price,
      'available',
    ]
  ).catch(() => {});

  db.addLog({
    action: 'Thêm sân mới',
    detail: `Thêm sân đấu mới: ${newCourt.name}`,
    user: req.user ? req.user.name : 'Quản lý',
    type: 'court',
  });

  res.status(201).json({
    success: true,
    message: 'Thêm sân đấu mới thành công',
    data: newCourt,
  });
}

// PATCH /api/courts/:id/price
function updateCourtPrice(req, res) {
  const { id } = req.params;
  const { price } = req.body;

  if (!price || isNaN(price)) {
    return res.status(400).json({ success: false, message: 'Giá sân không hợp lệ' });
  }

  const updated = db.updateCourt(id, { price: Number(price) });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sân' });
  }

  pool.query('UPDATE courts SET price_per_hour = ? WHERE id = ?', [Number(price), id]).catch(() => {});

  res.json({
    success: true,
    message: 'Cập nhật giá sân thành công',
    data: updated,
  });
}

// GET /api/courts/clubs/all
function getClubs(req, res) {
  const clubs = db.getClubs();
  res.json({
    success: true,
    count: clubs.length,
    data: clubs,
  });
}

module.exports = {
  getAllCourts,
  getCourtById,
  updateCourtStatus,
  addCourt,
  updateCourtPrice,
  getClubs,
};

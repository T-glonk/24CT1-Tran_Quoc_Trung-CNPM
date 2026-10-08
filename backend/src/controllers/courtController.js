// ─── COURT & BRANCHES CONTROLLER (MYSQL & PERSISTENCE) ────────────────────────
const db = require('../config/db');
const { pool, query } = require('../config/mysql');

// GET /api/courts - Lấy danh sách sân (Đọc từ MySQL & Local Cache)
async function getAllCourts(req, res) {
  let courts = db.getCourts();

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM courts ORDER BY id ASC');
    if (rows && rows.length > 0) {
      courts = rows.map(r => ({
        id: String(r.id),
        name: r.name,
        clubId: r.club_id || 'c1',
        type: r.type || 'Thảm PVC thi đấu',
        price: Number(r.price || r.price_per_hour || 90000),
        status: r.status || 'available',
      }));
    }
  } catch (err) {
    courts = db.getCourts();
  }

  res.json({
    success: true,
    count: courts.length,
    data: courts,
  });
}

// GET /api/courts/:id - Lấy chi tiết sân theo ID từ MySQL
async function getCourtById(req, res) {
  const { id } = req.params;
  let court = null;

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM courts WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      court = {
        id: String(r.id),
        name: r.name,
        clubId: r.club_id || 'c1',
        type: r.type || 'Thảm PVC thi đấu',
        price: Number(r.price || r.price_per_hour || 90000),
        status: r.status || 'available',
      };
    }
  } catch (err) {
    court = db.getCourtById(id);
  }

  if (!court) court = db.getCourtById(id);

  if (!court) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sân' });
  }
  res.json({ success: true, data: court });
}

// PATCH /api/courts/:id/status - Cập nhật trạng thái sân vào MySQL
async function updateCourtStatus(req, res) {
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

  // Writes records to MySQL database
  try {
    await pool.query('UPDATE courts SET status = ? WHERE id = ?', [status, id]);
  } catch (err) {
    console.warn(`[MySQL Court Status Warning]: ${err.message}`);
  }

  // Ghi audit log
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

// POST /api/courts - Thêm sân đấu mới vào MySQL & Cache
async function addCourt(req, res) {
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

  // Writes records to MySQL database
  try {
    await pool.query(
      'INSERT INTO courts (id, club_id, name, type, price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [
        newCourt.id,
        newCourt.clubId || 'c1',
        newCourt.name,
        newCourt.type || 'Thảm PVC thi đấu',
        newCourt.price,
        'available',
      ]
    );
  } catch (err) {
    console.warn(`[MySQL Add Court Warning]: ${err.message}`);
  }

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

// PATCH /api/courts/:id/price - Cập nhật giá sân trong MySQL
async function updateCourtPrice(req, res) {
  const { id } = req.params;
  const { price } = req.body;

  if (!price || isNaN(price)) {
    return res.status(400).json({ success: false, message: 'Giá sân không hợp lệ' });
  }

  const updated = db.updateCourt(id, { price: Number(price) });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sân' });
  }

  // Writes records to MySQL database
  try {
    await pool.query('UPDATE courts SET price = ?, price_per_hour = ? WHERE id = ?', [Number(price), Number(price), id]);
  } catch (err) {
    console.warn(`[MySQL Price Update Warning]: ${err.message}`);
  }

  res.json({
    success: true,
    message: 'Cập nhật giá sân thành công',
    data: updated,
  });
}

// GET /api/courts/clubs/all - Lấy danh sách câu lạc bộ / chi nhánh từ MySQL
async function getClubs(req, res) {
  let clubs = db.getClubs();

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM clubs ORDER BY id ASC');
    if (rows && rows.length > 0) {
      clubs = rows;
    }
  } catch (err) {
    clubs = db.getClubs();
  }

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


// ─── AUTHENTICATION & USER CONTROLLER (MYSQL & PERSISTENCE) ───────────────────
const db = require('../config/db');
const { pool, query } = require('../config/mysql');

// POST /api/auth/login - Đăng nhập tài khoản (Kiểm tra MySQL & Local Cache)
async function login(req, res) {
  const { account, email, phone, password } = req.body;
  const loginQuery = account || email || phone;

  if (!loginQuery || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu' });
  }

  let user = null;

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, password, role, status, joined_date as joinedDate, tier, total_spent as totalSpent, bookings_count as bookingsCount FROM users WHERE email = ? OR phone = ? LIMIT 1',
      [loginQuery, loginQuery]
    );
    if (rows && rows.length > 0) {
      user = rows[0];
    }
  } catch (err) {
    // Fallback to local store
    user = db.getUserByEmailOrPhone(loginQuery);
  }

  if (!user) {
    user = db.getUserByEmailOrPhone(loginQuery);
  }

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });
  }

  if (user.status === 'locked') {
    return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên.' });
  }

  // Ghi audit log vào MySQL và cache
  db.addLog({
    action: 'Đăng nhập hệ thống',
    detail: `${user.name} (${user.role}) đã đăng nhập`,
    user: user.name,
    type: 'security',
  });

  pool.query(
    'INSERT INTO activity_logs (id, action, detail, user_name, log_type, log_time) VALUES (?, ?, ?, ?, ?, ?)',
    [`L-${Date.now()}`, 'Đăng nhập hệ thống', `${user.name} (${user.role}) đã đăng nhập`, user.name, 'security', new Date().toLocaleString('vi-VN')]
  ).catch(() => {});

  return res.json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tier: user.tier || 'Đồng',
      status: user.status || 'active',
      joinedDate: user.joinedDate,
    },
  });
}

// POST /api/auth/register - Đăng ký tài khoản (Ghi vào MySQL & Local Cache)
async function register(req, res) {
  const { name, email, phone, password } = req.body;

  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Họ tên, Mật khẩu và Email/SĐT' });
  }

  if (email && db.getUserByEmailOrPhone(email)) {
    return res.status(409).json({ success: false, message: 'Email đã tồn tại trên hệ thống' });
  }

  if (phone && db.getUserByEmailOrPhone(phone)) {
    return res.status(409).json({ success: false, message: 'Số điện thoại đã tồn tại trên hệ thống' });
  }

  const newUser = db.addUser({
    name,
    email: email || `${phone}@court.vn`,
    phone: phone || '',
    password,
    role: 'customer',
  });

  // Writes records to MySQL database
  try {
    await pool.query(
      'INSERT INTO users (id, name, email, phone, password, role, status, joined_date, tier, total_spent, bookings_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.phone,
        newUser.password,
        newUser.role,
        newUser.status,
        newUser.joinedDate,
        newUser.tier,
        newUser.totalSpent,
        newUser.bookingsCount,
      ]
    );
  } catch (err) {
    console.warn(`[MySQL Auth Warning]: ${err.message}`);
  }

  db.addLog({
    action: 'Đăng ký tài khoản',
    detail: `Khách hàng mới ${newUser.name} đăng ký tài khoản`,
    user: newUser.name,
    type: 'security',
  });

  pool.query(
    'INSERT INTO activity_logs (id, action, detail, user_name, log_type, log_time) VALUES (?, ?, ?, ?, ?, ?)',
    [
      `L-${Date.now()}`,
      'Đăng ký tài khoản',
      `Khách hàng mới ${newUser.name} đăng ký tài khoản`,
      newUser.name,
      'security',
      new Date().toLocaleString('vi-VN'),
    ]
  ).catch(() => {});

  return res.status(201).json({
    success: true,
    message: 'Đăng ký tài khoản thành công',
    data: newUser,
  });
}

// GET /api/auth/profile - Lấy thông tin tài khoản hiện tại từ MySQL
async function getProfile(req, res) {
  const userId = req.headers['x-user-id'] || (req.user && req.user.id);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }

  let user = null;
  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
    if (rows && rows.length > 0) user = rows[0];
  } catch (err) {
    user = db.getUserById(userId);
  }

  if (!user) {
    user = db.getUserById(userId);
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }

  return res.json({
    success: true,
    data: user,
  });
}

module.exports = {
  login,
  register,
  getProfile,
};


// ─── AUTH CONTROLLER ─────────────────────────────────────────────────────────
const db = require('../config/db');

// POST /api/auth/login
function login(req, res) {
  const { account, email, phone, password } = req.body;
  const loginQuery = account || email || phone;

  if (!loginQuery || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu' });
  }

  const user = db.getUserByEmailOrPhone(loginQuery);

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });
  }

  if (user.status === 'locked') {
    return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên.' });
  }

  // Add audit log
  db.addLog({
    action: 'Đăng nhập hệ thống',
    detail: `${user.name} (${user.role}) đã đăng nhập`,
    user: user.name,
    type: 'security',
  });

  return res.json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tier: user.tier,
      status: user.status,
      joinedDate: user.joinedDate,
    },
  });
}

// POST /api/auth/register
function register(req, res) {
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

  db.addLog({
    action: 'Đăng ký tài khoản',
    detail: `Khách hàng mới ${newUser.name} đăng ký tài khoản`,
    user: newUser.name,
    type: 'security',
  });

  return res.status(201).json({
    success: true,
    message: 'Đăng ký tài khoản thành công',
    data: newUser,
  });
}

// GET /api/auth/profile
function getProfile(req, res) {
  const userId = req.headers['x-user-id'] || (req.user && req.user.id);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }

  const user = db.getUserById(userId);
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

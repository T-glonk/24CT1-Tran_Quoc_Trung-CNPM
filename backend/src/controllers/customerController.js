// ─── CUSTOMER & MEMBERS CRM CONTROLLER ───────────────────────────────────────
const db = require('../config/db');

// GET /api/customers
function getAllCustomers(req, res) {
  const users = db.getUsers();
  res.json({
    success: true,
    count: users.length,
    data: users,
  });
}

// GET /api/customers/:id
function getCustomerById(req, res) {
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
  }
  const bookings = db.getBookings().filter(b => b.userId === user.id);
  res.json({
    success: true,
    data: { ...user, bookingsHistory: bookings },
  });
}

// PATCH /api/customers/:id/toggle-status
function toggleCustomerStatus(req, res) {
  const { id } = req.params;
  const user = db.getUserById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
  }

  const newStatus = user.status === 'active' ? 'locked' : 'active';
  const updated = db.updateUser(id, { status: newStatus });

  db.addLog({
    action: newStatus === 'locked' ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
    detail: `${newStatus === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản ${user.name}`,
    user: req.user ? req.user.name : 'Admin',
    type: 'security',
  });

  res.json({
    success: true,
    message: `Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản thành công`,
    data: updated,
  });
}

// PATCH /api/customers/:id/role
function updateCustomerRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['admin', 'manager', 'staff', 'customer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Vai trò phân quyền không hợp lệ' });
  }

  const updated = db.updateUser(id, { role });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
  }

  db.addLog({
    action: 'Phân quyền tài khoản',
    detail: `Cập nhật vai trò của ${updated.name} thành "${role}"`,
    user: req.user ? req.user.name : 'Admin',
    type: 'security',
  });

  res.json({
    success: true,
    message: 'Cập nhật phân quyền thành công',
    data: updated,
  });
}

// POST /api/customers
function addCustomer(req, res) {
  const { name, email, phone, role, password, tier } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Họ tên là bắt buộc' });
  }

  const newUser = db.addUser({
    name,
    email: email || `${Date.now()}@court.vn`,
    phone: phone || '',
    password: password || '123456',
    role: role || 'customer',
    tier: tier || 'Đồng',
    status: 'active',
  });

  res.status(201).json({
    success: true,
    message: 'Thêm khách hàng mới thành công',
    data: newUser,
  });
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  toggleCustomerStatus,
  updateCustomerRole,
  addCustomer,
};

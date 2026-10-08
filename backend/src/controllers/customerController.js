// ─── CUSTOMER & CRM CONTROLLER (MYSQL & PERSISTENCE) ──────────────────────────
const db = require('../config/db');
const { pool, query } = require('../config/mysql');

// GET /api/customers - Lấy danh sách khách hàng từ MySQL & Cache
async function getAllCustomers(req, res) {
  let users = db.getUsers();

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
    if (rows && rows.length > 0) {
      users = rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        role: r.role,
        tier: r.tier || 'Đồng',
        status: r.status || 'active',
        totalSpent: Number(r.total_spent || 0),
        bookingsCount: Number(r.bookings_count || 0),
        joinedDate: r.joined_date || '',
      }));
    }
  } catch (err) {
    users = db.getUsers();
  }

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
}

// GET /api/customers/:id - Lấy chi tiết khách hàng & lịch sử từ MySQL
async function getCustomerById(req, res) {
  const { id } = req.params;
  let user = null;

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      user = {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        role: r.role,
        tier: r.tier || 'Đồng',
        status: r.status || 'active',
        totalSpent: Number(r.total_spent || 0),
        bookingsCount: Number(r.bookings_count || 0),
        joinedDate: r.joined_date || '',
      };
    }
  } catch (err) {
    user = db.getUserById(id);
  }

  if (!user) user = db.getUserById(id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
  }

  let bookings = [];
  try {
    const [bookingRows] = await pool.query('SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC', [id]);
    if (bookingRows && bookingRows.length > 0) {
      bookings = bookingRows;
    } else {
      bookings = db.getBookings().filter(b => b.userId === user.id);
    }
  } catch (err) {
    bookings = db.getBookings().filter(b => b.userId === user.id);
  }

  res.json({
    success: true,
    data: { ...user, bookingsHistory: bookings },
  });
}

// PATCH /api/customers/:id/toggle-status - Khóa/Mở khóa tài khoản trên MySQL
async function toggleCustomerStatus(req, res) {
  const { id } = req.params;
  const user = db.getUserById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
  }

  const newStatus = user.status === 'active' ? 'locked' : 'active';
  const updated = db.updateUser(id, { status: newStatus });

  // Writes records to MySQL database
  try {
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
  } catch (err) {
    console.warn(`[MySQL Customer Status Warning]: ${err.message}`);
  }

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

// PATCH /api/customers/:id/role - Cập nhật phân quyền vào MySQL
async function updateCustomerRole(req, res) {
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

  // Writes records to MySQL database
  try {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  } catch (err) {
    console.warn(`[MySQL Role Update Warning]: ${err.message}`);
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

// POST /api/customers - Thêm khách hàng mới vào MySQL
async function addCustomer(req, res) {
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
        0,
        0,
      ]
    );
  } catch (err) {
    console.warn(`[MySQL Add Customer Warning]: ${err.message}`);
  }

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


// ─── SERVICES & POS INVENTORY CONTROLLER (MYSQL & PERSISTENCE) ───────────────
const db = require('../config/db');
const { pool, query } = require('../config/mysql');

// GET /api/services - Lấy danh mục sản phẩm/dịch vụ từ MySQL & Cache
async function getAllServices(req, res) {
  const { category } = req.query;
  let services = db.getServices();

  // Reads records from MySQL pool
  try {
    let sql = 'SELECT * FROM services WHERE status = "active"';
    const params = [];
    if (category) {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }
    const [rows] = await pool.query(sql, params);
    if (rows && rows.length > 0) {
      services = rows.map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        price: Number(r.price),
        cost: Number(r.cost || 0),
        stock: Number(r.stock || 0),
        unit: r.unit || 'Cái',
        icon: r.icon || '📦',
      }));
    }
  } catch (err) {
    services = db.getServices();
  }

  if (category) {
    services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  res.json({
    success: true,
    count: services.length,
    data: services,
  });
}


// PATCH /api/services/:id/stock
function updateStock(req, res) {
  const { id } = req.params;
  const { stock, delta } = req.body;

  const item = db.getServiceById(id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  }

  const newStock = stock !== undefined ? Number(stock) : Math.max(0, item.stock + (Number(delta) || 0));
  const updated = db.updateService(id, { stock: newStock });

  // Sync MySQL
  pool.query('UPDATE services SET stock = ? WHERE id = ?', [newStock, id]).catch(() => {});

  res.json({
    success: true,
    message: 'Cập nhật tồn kho thành công',
    data: updated,
  });
}

// POST /api/services
function addService(req, res) {
  const { name, category, price, cost, stock, unit, icon } = req.body;

  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Tên sản phẩm và giá bán là bắt buộc' });
  }

  const newService = db.addService({
    name,
    category: category || 'Nước uống',
    price: Number(price),
    cost: Number(cost || 0),
    stock: Number(stock || 0),
    unit: unit || 'Cái',
    icon: icon || '📦',
  });

  // Sync MySQL
  pool.query(
    'INSERT INTO services (id, name, category, price, cost, stock, unit, icon, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newService.id,
      newService.name,
      newService.category,
      newService.price,
      newService.cost,
      newService.stock,
      newService.unit,
      newService.icon,
      'active',
    ]
  ).catch(() => {});

  db.addLog({
    action: 'Thêm sản phẩm mới',
    detail: `Thêm món "${newService.name}" vào kho hàng POS`,
    user: req.user ? req.user.name : 'Quản lý',
    type: 'service',
  });

  res.status(201).json({
    success: true,
    message: 'Thêm sản phẩm mới thành công',
    data: newService,
  });
}

// POST /api/services/pos-checkout
function posCheckout(req, res) {
  const { items, totalAmount, customerName, paymentMethod } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'Giỏ hàng POS trống' });
  }

  // Deduct stock for each item
  items.forEach(item => {
    const s = db.getServiceById(item.id);
    if (s && s.stock >= item.qty) {
      const remainingStock = s.stock - item.qty;
      db.updateService(item.id, { stock: remainingStock });
      pool.query('UPDATE services SET stock = ? WHERE id = ?', [remainingStock, item.id]).catch(() => {});
    }
  });

  // Record Transaction
  const newTxn = db.addTransaction({
    customerName: customerName || 'Khách lẻ tại quầy POS',
    amount: totalAmount || 0,
    method: paymentMethod || 'Tiền mặt',
    status: 'completed',
    ref: 'POS-CASH',
  });

  // Sync transaction to MySQL
  pool.query(
    'INSERT INTO transactions (id, customer_name, amount, type, method, status, reference_code, transaction_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newTxn.id,
      customerName || 'Khách lẻ tại quầy POS',
      totalAmount || 0,
      'income',
      paymentMethod || 'Tiền mặt',
      'completed',
      'POS-CASH',
      new Date().toLocaleString('vi-VN'),
    ]
  ).catch(err => console.warn('[MySQL POS Transaction Warning]:', err.message));

  // Audit Log
  db.addLog({
    action: 'Bán hàng POS tại quầy',
    detail: `Đơn POS ${items.length} món. Tổng tiền: ${(totalAmount || 0).toLocaleString('vi-VN')} đ`,
    user: req.user ? req.user.name : 'Thu ngân',
    type: 'service',
  });

  pool.query(
    'INSERT INTO activity_logs (id, action, detail, user_name, log_type, log_time) VALUES (?, ?, ?, ?, ?, ?)',
    [
      `L-${Date.now()}`,
      'Bán hàng POS tại quầy',
      `Đơn POS ${items.length} món. Tổng: ${(totalAmount || 0).toLocaleString('vi-VN')} đ`,
      req.user ? req.user.name : 'Thu ngân',
      'service',
      new Date().toLocaleString('vi-VN'),
    ]
  ).catch(() => {});

  res.json({
    success: true,
    message: 'Thanh toán đơn hàng POS thành công',
    data: { transaction: newTxn },
  });
}

module.exports = {
  getAllServices,
  updateStock,
  addService,
  posCheckout,
};

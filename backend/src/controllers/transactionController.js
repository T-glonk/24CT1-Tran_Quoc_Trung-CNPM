// ─── TRANSACTION & FINANCIAL LEDGER CONTROLLER (MYSQL & PERSISTENCE) ───────────
const db = require('../config/db');
const { pool, query } = require('../config/mysql');

// GET /api/transactions - Lấy danh sách sổ quỹ thu chi từ MySQL & Cache
async function getAllTransactions(req, res) {
  let transactions = db.getTransactions();

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
    if (rows && rows.length > 0) {
      transactions = rows.map(r => ({
        id: r.id,
        bookingId: r.booking_id,
        customerName: r.customer_name,
        amount: Number(r.amount),
        type: r.type || 'income',
        method: r.method || 'Tiền mặt',
        status: r.status || 'completed',
        ref: r.reference_code || 'MANUAL-ENTRY',
        time: r.transaction_time || new Date().toLocaleString('vi-VN'),
      }));
    }
  } catch (err) {
    transactions = db.getTransactions();
  }

  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
}

// POST /api/transactions - Tạo giao dịch thu chi mới vào MySQL
async function createTransaction(req, res) {
  const { customerName, amount, method, ref, bookingId } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Số tiền giao dịch không hợp lệ' });
  }

  const newTxn = db.addTransaction({
    bookingId: bookingId || null,
    customerName: customerName || 'Khách vãng lai',
    amount: Number(amount),
    method: method || 'Tiền mặt',
    status: 'completed',
    ref: ref || 'MANUAL-ENTRY',
  });

  // Writes records to MySQL database
  try {
    await pool.query(
      'INSERT INTO transactions (id, booking_id, customer_name, amount, type, method, status, reference_code, transaction_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newTxn.id,
        bookingId || null,
        customerName || 'Khách vãng lai',
        Number(amount),
        'income',
        method || 'Tiền mặt',
        'completed',
        ref || 'MANUAL-ENTRY',
        new Date().toLocaleString('vi-VN'),
      ]
    );
  } catch (err) {
    console.warn(`[MySQL Transaction Add Warning]: ${err.message}`);
  }

  res.status(201).json({
    success: true,
    message: 'Tạo giao dịch thành công',
    data: newTxn,
  });
}

module.exports = {
  getAllTransactions,
  createTransaction,
};


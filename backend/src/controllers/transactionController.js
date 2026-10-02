// ─── TRANSACTION & CASH BOOK CONTROLLER ──────────────────────────────────────
const db = require('../config/db');

// GET /api/transactions
function getAllTransactions(req, res) {
  const transactions = db.getTransactions();
  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
}

// POST /api/transactions
function createTransaction(req, res) {
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

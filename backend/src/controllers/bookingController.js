// ─── BOOKING CONTROLLER ──────────────────────────────────────────────────────
const db = require('../config/db');
const { pool } = require('../config/mysql');

// GET /api/bookings
function getAllBookings(req, res) {
  const { status, userId } = req.query;
  let bookings = db.getBookings();

  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }
  if (userId) {
    bookings = bookings.filter(b => b.userId === userId);
  }

  res.json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
}

// GET /api/bookings/:id
function getBookingById(req, res) {
  const booking = db.getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt sân' });
  }
  res.json({ success: true, data: booking });
}

// POST /api/bookings
function createBooking(req, res) {
  const { courtId, court, userId, userName, userPhone, date, slot, hoursCount, totalPrice, servicesAdded, grandTotal, paymentMethod, note } = req.body;

  const targetCourt = court || db.getCourtById(courtId);
  if (!targetCourt) {
    return res.status(400).json({ success: false, message: 'Thông tin sân không hợp lệ' });
  }

  const newBooking = db.addBooking({
    court: targetCourt,
    courtId: targetCourt.id,
    userId: userId || 'guest',
    userName: userName || 'Khách đặt sân',
    userPhone: userPhone || '',
    date: date || new Date().toLocaleDateString('vi-VN'),
    slot: slot || 'Tiêu chuẩn',
    hoursCount: hoursCount || 1,
    totalPrice: totalPrice || targetCourt.price,
    servicesAdded: servicesAdded || [],
    grandTotal: grandTotal || totalPrice || targetCourt.price,
    paymentMethod: paymentMethod || 'Chuyển khoản QR',
    paymentStatus: 'paid',
    status: 'confirmed',
    note: note || '',
  });

  // Automatically record a transaction
  const newTxn = db.addTransaction({
    bookingId: newBooking.id,
    customerName: newBooking.userName,
    amount: newBooking.grandTotal,
    method: newBooking.paymentMethod,
    status: 'completed',
    ref: 'ONLINE-APP',
  });

  // Async sync to MySQL Server
  const safeUserId = (newBooking.userId && newBooking.userId !== 'guest' && db.getUserById(newBooking.userId)) ? newBooking.userId : null;
  const safeCourtId = String(targetCourt.id || '1');
  const safeCourtName = targetCourt.name || 'Sân 1';
  const safePrice = Number(targetCourt.price || 80000);

  // Ensure court exists in MySQL courts table to satisfy foreign key
  pool.query(
    'INSERT INTO courts (id, club_id, name, type, price, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price)',
    [safeCourtId, targetCourt.clubId || 'c1', safeCourtName, targetCourt.type || 'Thảm PVC thi đấu', safePrice, 'available']
  ).then(() => {
    return pool.query(
      'INSERT INTO bookings (id, user_id, court_id, user_name, user_phone, booking_date, slot_time, hours_count, court_price, services_total, grand_total, payment_method, payment_status, status, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newBooking.id,
        safeUserId,
        safeCourtId,
        newBooking.userName,
        newBooking.userPhone,
        newBooking.date,
        newBooking.slot,
        Number(newBooking.hoursCount || 1),
        Number(newBooking.totalPrice || targetCourt.price),
        Number((newBooking.grandTotal || newBooking.totalPrice || 0) - (newBooking.totalPrice || 0)),
        Number(newBooking.grandTotal || targetCourt.price),
        newBooking.paymentMethod,
        newBooking.paymentStatus || 'paid',
        newBooking.status || 'confirmed',
        newBooking.note || '',
        new Date().toLocaleString('vi-VN'),
      ]
    );
  }).catch(err => {
    console.warn('[MySQL Booking Insert Warning]:', err.message);
  });

  pool.query(
    'INSERT INTO transactions (id, booking_id, customer_name, amount, type, method, status, reference_code, transaction_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newTxn.id,
      newBooking.id,
      newBooking.userName,
      Number(newBooking.grandTotal || targetCourt.price),
      'income',
      newBooking.paymentMethod,
      'completed',
      'ONLINE-APP',
      new Date().toLocaleString('vi-VN'),
    ]
  ).catch(err => {
    console.warn('[MySQL Transaction Insert Warning]:', err.message);
  });

  // Audit log
  db.addLog({
    action: 'Tạo đơn đặt sân',
    detail: `Đơn mới ${newBooking.id} cho ${newBooking.userName} (${targetCourt.name})`,
    user: userName || 'Khách hàng',
    type: 'booking',
  });

  pool.query(
    'INSERT INTO activity_logs (id, action, detail, user_name, log_type, log_time) VALUES (?, ?, ?, ?, ?, ?)',
    [
      `L-${Date.now()}`,
      'Tạo đơn đặt sân',
      `Đơn mới ${newBooking.id} cho ${newBooking.userName} (${targetCourt.name})`,
      userName || 'Khách hàng',
      'booking',
      new Date().toLocaleString('vi-VN'),
    ]
  ).catch(() => {});

  res.status(201).json({
    success: true,
    message: 'Đặt sân thành công',
    data: newBooking,
  });
}

// PATCH /api/bookings/:id/status
function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status, note } = req.body;

  const validStatuses = ['pending', 'confirmed', 'in_use', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái đơn không hợp lệ' });
  }

  const updates = { status };
  if (note) updates.note = note;

  const updated = db.updateBooking(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt sân' });
  }

  pool.query('UPDATE bookings SET status = ?, note = COALESCE(?, note) WHERE id = ?', [status, note || null, id])
    .catch(err => console.warn('[MySQL Booking Status Update Warning]:', err.message));

  db.addLog({
    action: 'Cập nhật đơn đặt sân',
    detail: `Đơn ${id} đổi trạng thái thành ${status}`,
    user: req.user ? req.user.name : 'Quản lý',
    type: 'booking',
  });

  res.json({
    success: true,
    message: 'Cập nhật trạng thái đơn thành công',
    data: updated,
  });
}

// POST /api/bookings/:id/cancel
function cancelBooking(req, res) {
  const { id } = req.params;
  const { reason } = req.body;

  const updated = db.updateBooking(id, {
    status: 'cancelled',
    note: reason ? `Hủy: ${reason}` : 'Đã hủy bởi người dùng',
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt sân' });
  }

  pool.query('UPDATE bookings SET status = ?, note = ? WHERE id = ?', ['cancelled', reason ? `Hủy: ${reason}` : 'Đã hủy bởi người dùng', id])
    .catch(err => console.warn('[MySQL Booking Cancel Warning]:', err.message));

  db.addLog({
    action: 'Hủy đơn đặt sân',
    detail: `Hủy đơn ${id}. Lý do: ${reason || 'Khách tự hủy'}`,
    user: req.user ? req.user.name : 'Khách hàng',
    type: 'booking',
  });

  res.json({
    success: true,
    message: 'Hủy đơn đặt sân thành công',
    data: updated,
  });
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
};

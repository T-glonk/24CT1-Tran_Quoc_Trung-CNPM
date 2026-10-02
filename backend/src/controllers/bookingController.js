// ─── BOOKING CONTROLLER ──────────────────────────────────────────────────────
const db = require('../config/db');

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
  db.addTransaction({
    bookingId: newBooking.id,
    customerName: newBooking.userName,
    amount: newBooking.grandTotal,
    method: newBooking.paymentMethod,
    status: 'completed',
    ref: 'ONLINE-APP',
  });

  // Audit log
  db.addLog({
    action: 'Tạo đơn đặt sân',
    detail: `Đơn mới ${newBooking.id} cho ${newBooking.userName} (${targetCourt.name})`,
    user: userName || 'Khách hàng',
    type: 'booking',
  });

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

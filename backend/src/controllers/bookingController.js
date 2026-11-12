// ─── BOOKING & RESERVATION CONTROLLER (MYSQL & PERSISTENCE) ──────────────────
const db = require('../config/db');
const { pool, query } = require('../config/mysql');

// GET /api/bookings - Lấy danh sách đơn đặt sân (Đọc từ MySQL & Local Cache)
async function getAllBookings(req, res) {
  const { status, userId } = req.query;
  let bookings = db.getBookings();

  // Reads records from MySQL pool
  try {
    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }
    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);
    if (rows && rows.length > 0) {
      // Lấy danh sách các dịch vụ đi kèm của tất cả các đơn
      const bookingIds = rows.map((r) => r.id);
      let allServices = [];
      try {
        const [serviceRows] = await pool.query(
          'SELECT booking_id as bookingId, service_id as id, service_name as name, quantity as qty, unit_price as price, total_price as totalPrice FROM booking_services WHERE booking_id IN (?)',
          [bookingIds]
        );
        allServices = serviceRows || [];
      } catch (err) {
        allServices = [];
      }

      bookings = rows.map(r => ({
        id: r.id,
        courtId: r.court_id,
        userId: r.user_id,
        userName: r.user_name,
        userPhone: r.user_phone,
        date: r.booking_date,
        slot: r.slot_time,
        hoursCount: r.hours_count,
        totalPrice: r.court_price,
        grandTotal: r.grand_total,
        paymentMethod: r.payment_method,
        paymentStatus: r.payment_status,
        status: r.status,
        note: r.note,
        createdAt: r.created_at,
        court: db.getCourtById(r.court_id) || { name: `Sân ${r.court_id}` },
        servicesAdded: allServices.filter(s => s.bookingId === r.id),
      }));
    }
  } catch (err) {
    bookings = db.getBookings();
  }

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

// GET /api/bookings/:id - Lấy chi tiết đơn đặt sân từ MySQL
async function getBookingById(req, res) {
  const { id } = req.params;
  let booking = null;

  // Reads records from MySQL pool
  try {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ? LIMIT 1', [id]);
    if (rows && rows.length > 0) {
      const r = rows[0];

      let servicesAdded = [];
      try {
        const [serviceRows] = await pool.query(
          'SELECT service_id as id, service_name as name, quantity as qty, unit_price as price, total_price as totalPrice FROM booking_services WHERE booking_id = ?',
          [id]
        );
        servicesAdded = serviceRows || [];
      } catch (err) {
        servicesAdded = [];
      }

      booking = {
        id: r.id,
        courtId: r.court_id,
        userId: r.user_id,
        userName: r.user_name,
        userPhone: r.user_phone,
        date: r.booking_date,
        slot: r.slot_time,
        hoursCount: r.hours_count,
        totalPrice: r.court_price,
        grandTotal: r.grand_total,
        paymentMethod: r.payment_method,
        paymentStatus: r.payment_status,
        status: r.status,
        note: r.note,
        createdAt: r.created_at,
        court: db.getCourtById(r.court_id) || { name: `Sân ${r.court_id}` },
        servicesAdded,
      };
    }
  } catch (err) {
    booking = db.getBookingById(id);
  }

  if (!booking) booking = db.getBookingById(id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt sân' });
  }
  res.json({ success: true, data: booking });
}


// POST /api/bookings
async function createBooking(req, res) {
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

  try {
    // 1. Đảm bảo sân tồn tại trong MySQL courts table để thỏa mãn foreign key
    await pool.query(
      'INSERT INTO courts (id, club_id, name, type, price, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price)',
      [safeCourtId, targetCourt.clubId || 'c1', safeCourtName, targetCourt.type || 'Thảm PVC thi đấu', safePrice, 'available']
    );

    // 2. Lưu đơn đặt sân vào MySQL bookings table
    await pool.query(
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
    console.log(`[MySQL Success] ✅ Đã lưu đơn đặt sân ${newBooking.id} vào MySQL.`);

    // 3. Lưu chi tiết các dịch vụ đi kèm vào bảng booking_services
    if (Array.isArray(newBooking.servicesAdded) && newBooking.servicesAdded.length > 0) {
      for (const item of newBooking.servicesAdded) {
        const qty = Number(item.qty || item.quantity || 1);
        const unitPrice = Number(item.price || item.unitPrice || 0);
        const itemTotalPrice = qty * unitPrice;
        const serviceId = String(item.id || 's1');
        const serviceName = item.name || 'Dịch vụ tiện ích';

        // Đảm bảo mã dịch vụ tồn tại trong bảng services để thỏa mãn foreign key constraint
        await pool.query(
          'INSERT INTO services (id, name, category, price, stock, unit, status) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price)',
          [serviceId, serviceName, 'drink', unitPrice, 50, 'món', 'active']
        ).catch(() => {});

        await pool.query(
          'INSERT INTO booking_services (booking_id, service_id, service_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
          [
            newBooking.id,
            serviceId,
            serviceName,
            qty,
            unitPrice,
            itemTotalPrice,
          ]
        );
        console.log(`[MySQL Success] ✅ Đã lưu dịch vụ: ${serviceName} (SL: ${qty}) vào bảng booking_services cho đơn ${newBooking.id}`);
      }
    }
  } catch (err) {
    console.warn('[MySQL Booking Insert Warning]:', err.message);
  }

  // 4. Lưu sổ quỹ giao dịch (transactions)
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

  // 5. Ghi nhật ký hoạt động (activity_logs)
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

  return res.status(201).json({
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

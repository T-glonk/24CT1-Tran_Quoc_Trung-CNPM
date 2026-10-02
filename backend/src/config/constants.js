// ─── SYSTEM CONSTANTS & STATUS DEFINITIONS ────────────────────────────────────

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

const COURT_STATUS = {
  AVAILABLE: 'available',     // Sẵn sàng / Trống
  BOOKED: 'booked',           // Đã đặt
  IN_USE: 'in_use',           // Đang sử dụng
  MAINTENANCE: 'maintenance', // Đang bảo trì
};

const BOOKING_STATUS = {
  PENDING: 'pending',         // Chờ duyệt
  CONFIRMED: 'confirmed',     // Đã xác nhận
  IN_USE: 'in_use',           // Đang thi đấu
  COMPLETED: 'completed',     // Hoàn thành
  CANCELLED: 'cancelled',     // Đã hủy
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

const PAYMENT_METHODS = {
  QR_TRANSFER: 'Chuyển khoản QR',
  VNPAY: 'VNPay',
  CASH: 'Tiền mặt',
};

module.exports = {
  ROLES,
  COURT_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
};

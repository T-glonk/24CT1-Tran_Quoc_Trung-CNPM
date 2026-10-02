// ─── TRANSACTIONS & AUDIT LOGS SEED DATA ─────────────────────────────────────

const INITIAL_TRANSACTIONS = [
  { id: 'TXN-901', bookingId: 'BK-1001', customerName: 'Hoàng Minh Đức', amount: 190000, method: 'Chuyển khoản QR', status: 'completed', time: '28/08/2026 09:35', ref: 'MB-89234821' },
  { id: 'TXN-902', bookingId: 'BK-1002', customerName: 'Trung Quốc', amount: 420000, method: 'VNPay', status: 'completed', time: '28/08/2026 08:18', ref: 'VNP-1823901' },
  { id: 'TXN-903', bookingId: 'BK-1003', customerName: 'Phạm Thị Mai', amount: 260000, method: 'Tiền mặt', status: 'completed', time: '28/08/2026 08:52', ref: 'CASH-POS1' },
  { id: 'TXN-904', bookingId: 'BK-1004', customerName: 'Hoàng Minh Đức', amount: 360000, method: 'Chuyển khoản QR', status: 'pending', time: '28/08/2026 10:10', ref: 'VCB-Pending' },
  { id: 'TXN-905', bookingId: 'BK-1005', customerName: 'Trung Quốc', amount: 200000, method: 'Chuyển khoản QR', status: 'completed', time: '27/08/2026 06:48', ref: 'MB-7712399' },
  { id: 'TXN-906', bookingId: 'BK-1006', customerName: 'Đặng Tuấn Anh', amount: 180000, method: 'Tiền mặt', status: 'refunded', time: '27/08/2026 15:00', ref: 'REFUND-001' },
];

const INITIAL_ACTIVITY_LOGS = [
  { id: 'L-1', action: 'Duyệt đơn đặt sân', detail: 'Admin xác nhận đơn BK-1002 cho Trung Quốc', user: 'Trần Quốc Trung', time: '10:15 - Hôm nay', type: 'booking' },
  { id: 'L-2', action: 'Cập nhật trạng thái sân', detail: 'Chuyển Sân 1 - TPT Sport sang Đang sử dụng', user: 'Lê Thu Ngân', time: '10:00 - Hôm nay', type: 'court' },
  { id: 'L-3', action: 'Xuất kho sản phẩm', detail: 'Bán 2 chai Revive cho đơn BK-1001', user: 'Lê Thu Ngân', time: '09:35 - Hôm nay', type: 'service' },
  { id: 'L-4', action: 'Bảo trì sân đấu', detail: 'Đặt Sân 2 - Nestworld sang Bảo dưỡng đèn LED', user: 'Nguyễn Văn Quản Lý', time: '07:30 - Hôm nay', type: 'court' },
  { id: 'L-5', action: 'Khóa tài khoản', detail: 'Khóa tài khoản Đặng Tuấn Anh do vi phạm hủy giờ sát', user: 'Trần Quốc Trung', time: '27/08/2026 16:00', type: 'security' },
];

module.exports = { INITIAL_TRANSACTIONS, INITIAL_ACTIVITY_LOGS };

-- =============================================================================
-- DATABASE SCHEMA: Alobo Badminton Court Booking & Management System
-- Compatible with: MySQL 8.0+ / PostgreSQL 14+ / SQLite 3
-- Author: Tran Quoc Trung (24CT1)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Table: users (Tài khoản người dùng, khách hàng, nhân viên, quản trị viên)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
    tier VARCHAR(20) DEFAULT 'Đồng' CHECK (tier IN ('Đồng', 'Bạc', 'Vàng', 'Kim Cương')),
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    bookings_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'locked')),
    avatar_url VARCHAR(255),
    joined_date VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. Table: clubs (Cụm sân / Câu lạc bộ)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clubs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Đà Nẵng',
    phone VARCHAR(20),
    open_time VARCHAR(10) DEFAULT '05:00',
    close_time VARCHAR(10) DEFAULT '23:00',
    price_range VARCHAR(50),
    rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    image VARCHAR(255),
    amenities TEXT, -- JSON or comma-separated list
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. Table: courts (Danh mục sân cầu lông thuộc cụm sân)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courts (
    id VARCHAR(50) PRIMARY KEY,
    club_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'Thảm BWF Tiêu chuẩn',
    price DECIMAL(10, 2) NOT NULL DEFAULT 80000.00,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'locked')),
    current_guest VARCHAR(150),
    current_slot VARCHAR(50),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_court_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 4. Table: bookings (Đơn đặt sân)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    court_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20),
    booking_date VARCHAR(30) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    hours_count DECIMAL(3, 1) DEFAULT 1.0,
    court_price DECIMAL(10, 2) NOT NULL,
    services_total DECIMAL(10, 2) DEFAULT 0.00,
    grand_total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Chuyển khoản QR' CHECK (payment_method IN ('Chuyển khoản QR', 'Tiền mặt', 'Ví điện tử')),
    payment_status VARCHAR(20) DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'refunded')),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'in_use', 'completed', 'cancelled')),
    note TEXT,
    created_at VARCHAR(50),
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_booking_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 5. Table: services (Danh mục sản phẩm, đồ uống & phụ kiện bán tại quầy POS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'drink', 'gear', 'shuttlecock', 'rental'
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'chai',
    icon VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 6. Table: booking_services (Chi tiết dịch vụ đi kèm trong đơn đặt sân)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_bs_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- -----------------------------------------------------------------------------
-- 7. Table: transactions (Sổ quỹ thu chi, dòng tiền)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    booking_id VARCHAR(50),
    customer_name VARCHAR(100),
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) DEFAULT 'income' CHECK (type IN ('income', 'expense')),
    method VARCHAR(50) DEFAULT 'Chuyển khoản QR',
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
    transaction_time VARCHAR(50),
    reference_code VARCHAR(100),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 8. Table: activity_logs (Nhật ký hoạt động & Audit Logs hệ thống)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(50) PRIMARY KEY,
    action VARCHAR(150) NOT NULL,
    detail TEXT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    log_type VARCHAR(50) DEFAULT 'system', -- 'security', 'booking', 'court', 'pos', 'system'
    log_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- INDEXES FOR OPTIMIZED QUERYING
-- -----------------------------------------------------------------------------
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_bookings_court ON bookings(court_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_courts_status ON courts(status);
CREATE INDEX idx_transactions_booking ON transactions(booking_id);

-- =============================================================================
-- SEED DATA INITIALIZATION
-- =============================================================================

-- Seed Users
INSERT INTO users (id, name, email, phone, password, role, tier, total_spent, bookings_count, status, joined_date)
VALUES 
('u1', 'Trần Quốc Trung', 'admin@court.vn', '0905591379', '123456', 'admin', 'Kim Cương', 12500000.00, 48, 'active', '01/01/2024'),
('u2', 'Nguyễn Văn An', 'an.nguyen@gmail.com', '0912345678', '123456', 'customer', 'Vàng', 3600000.00, 18, 'active', '15/02/2024'),
('u3', 'Lê Thị Bích', 'bich.le@gmail.com', '0987654321', '123456', 'customer', 'Bạc', 1800000.00, 8, 'active', '01/03/2024'),
('u4', 'Phạm Quốc Cường', 'cuong.pham@gmail.com', '0933445566', '123456', 'customer', 'Đồng', 600000.00, 3, 'active', '10/03/2024'),
('u5', 'Hoàng Minh Tuấn', 'tuan.hoang@court.vn', '0977889900', '123456', 'staff', 'Đồng', 0.00, 0, 'active', '20/01/2024')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Clubs (QT Sport Chain - Alobooking Network)
INSERT INTO clubs (id, name, address, district, city, phone, open_time, close_time, price_range, rating, review_count, image, amenities)
VALUES 
('c1', 'QT Sport - Cơ sở 1: Sân Hoa Thiên Lý', '207 Quách Thị Trang, Hòa Xuân, Cẩm Lệ', 'Cẩm Lệ', 'Đà Nẵng', '0905591379', '05:00', '23:00', '60.000 - 120.000đ/h', 4.9, 156, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', 'Thảm BWF Yonex, Máy lạnh, Căng vợt lấy ngay, Nước uống, Bãi đỗ ô tô miễn phí'),
('c2', 'QT Sport - Cơ sở 2: Sân Kỳ Đồng', '93 Kỳ Đồng, Thanh Khê Đông, Thanh Khê', 'Thanh Khê', 'Đà Nẵng', '0905123456', '05:30', '22:30', '50.000 - 100.000đ/h', 4.8, 112, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80', 'Thảm PVC chống trơn, Wifi tốc độ cao, Phòng thay đồ, Căn tin thể thao'),
('c3', 'QT Sport - Cơ sở 3: Sân Sơn Trà Pro', '120 Ngô Quyền, An Hải Bắc, Sơn Trà', 'Sơn Trà', 'Đà Nẵng', '0935888999', '05:00', '23:00', '70.000 - 130.000đ/h', 5.0, 230, 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80', 'Đèn LED chống chói chuẩn BWF, Huấn luyện viên, Shop đồ tập cầu lông, Khán đài VIP'),
('c4', 'QT Sport - Cơ sở 4: ECO Badminton Center', '45 Huỳnh Tấn Phát, Tân Thuận Đông, Quận 7', 'Quận 7', 'TP.HCM', '0909333777', '05:00', '23:30', '70.000 - 140.000đ/h', 4.9, 188, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', 'Thảm Victor Master Pro, Hệ thống quạt làm mát, Tắm nóng lạnh, Bãi giữ xe 100 xe'),
('c5', 'QT Sport - Cơ sở 5: Sky Badminton Club', '18D Cộng Hòa, Phường 4, Tân Bình', 'Tân Bình', 'TP.HCM', '0918224556', '05:30', '23:00', '65.000 - 130.000đ/h', 4.7, 95, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80', 'Thảm Enlio cao cấp, Phòng tắm cá nhân, Nước giải khát thể thao Pocari/Revive'),
('c6', 'QT Sport - Cơ sở 6: CLB Hoàng Văn Thụ', '20 Hoàng Minh Giám, Phường 9, Phú Nhuận', 'Phú Nhuận', 'TP.HCM', '0903667889', '05:00', '22:30', '60.000 - 120.000đ/h', 4.8, 145, 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80', 'Trần cao 11m chuẩn quốc tế, Đèn LED chống lóa, Trọng tài điều hành giải đấu'),
('c7', 'QT Sport - Cơ sở 7: Gia Hân Badminton Arena', '38 Chế Lan Viên, Tây Thạnh, Tân Phú', 'Tân Phú', 'TP.HCM', '0979445667', '05:00', '23:00', '55.000 - 110.000đ/h', 4.6, 82, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', 'Sân thảm đỏ độc quyền, Cho thuê vợt cao cấp, Khu thể lực & khởi động'),
('c8', 'QT Sport - Cơ sở 8: Hồng Châu Sport Club', '56 Phan Đăng Lưu, Phường 5, Bình Thạnh', 'Bình Thạnh', 'TP.HCM', '0938556778', '05:30', '23:00', '65.000 - 135.000đ/h', 4.9, 168, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80', 'Thảm Yonex chính hãng, Khu vực máy lạnh chờ đấu, Máy căng vợt điện tử');

-- Seed Courts (Danh sách sân thi đấu thuộc chuỗi QT Sport)
INSERT INTO courts (id, club_id, name, type, price, status, current_guest, current_slot, image)
VALUES 
('1', 'c1', 'Sân 1 - Cơ sở 1 (Hoa Thiên Lý)', 'Thảm Yonex Tiêu chuẩn BWF', 80000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('2', 'c1', 'Sân 2 - Cơ sở 1 (Hoa Thiên Lý)', 'Thảm Yonex Tiêu chuẩn BWF', 80000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('3', 'c1', 'Sân 3 - Cơ sở 1 (Hoa Thiên Lý)', 'Thảm Yonex Tiêu chuẩn BWF', 80000.00, 'in_use', 'Nguyễn Văn An (0912345678)', '18:00 - 20:00', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('4', 'c1', 'Sân 4 - Cơ sở 1 (Hoa Thiên Lý)', 'Thảm Yonex Tiêu chuẩn BWF', 80000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('5', 'c1', 'Sân 5 - Cơ sở 1 (VIP Thảm Đỏ)', 'Thảm Victor Pro VIP', 120000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80'),
('6', 'c1', 'Sân 6 - Cơ sở 1 (Sân Đôi Thi Đấu)', 'Thảm Yonex Tiêu chuẩn BWF', 90000.00, 'in_use', 'Huy (0969678482)', '17:00 - 19:00', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('7', 'c1', 'Sân 7 - Cơ sở 1 (Hoa Thiên Lý)', 'Thảm Yonex Tiêu chuẩn BWF', 80000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('8', 'c1', 'Sân 8 - Cơ sở 1 (Bảo dưỡng)', 'Thảm Yonex Tiêu chuẩn BWF', 80000.00, 'maintenance', 'Bảo trì định kỳ', 'Cả ngày', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('9', 'c2', 'Sân 1 - Cơ sở 2 (Kỳ Đồng)', 'Thảm PVC Chống Trơn', 60000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80'),
('10', 'c2', 'Sân 2 - Cơ sở 2 (Kỳ Đồng)', 'Thảm PVC Chống Trơn', 60000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80'),
('11', 'c3', 'Sân 1 - Cơ sở 3 (Sơn Trà Pro)', 'Thảm Yonex Đèn Chống Lóa', 90000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=400&q=80'),
('12', 'c3', 'Sân 2 - Cơ sở 3 (Sơn Trà Pro)', 'Thảm Yonex Đèn Chống Lóa', 90000.00, 'in_use', 'Lê Thị Bích (0987654321)', '19:00 - 21:00', 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=400&q=80'),
('13', 'c4', 'Sân 1 - Cơ sở 4 (ECO Center Q7)', 'Thảm Victor Master Pro', 95000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('14', 'c5', 'Sân 1 - Cơ sở 5 (Sky Badminton)', 'Thảm Enlio Quốc Tế', 85000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80'),
('15', 'c6', 'Sân 1 - Cơ sở 6 (Hoàng Văn Thụ)', 'Thảm Yonex Trần Cao 11m', 80000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=400&q=80'),
('16', 'c7', 'Sân 1 - Cơ sở 7 (Gia Hân Arena)', 'Thảm Đỏ VIP Arena', 75000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'),
('17', 'c8', 'Sân 1 - Cơ sở 8 (Hồng Châu Club)', 'Thảm Yonex Chính Hãng', 85000.00, 'available', NULL, NULL, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80');

-- Seed Services
INSERT INTO services (id, name, category, price, stock, unit, icon, status)
VALUES 
('s1', 'Nước khoáng Lavie 500ml', 'drink', 10000.00, 48, 'chai', '💧', 'active'),
('s2', 'Nước điện giải Pocari Sweat 500ml', 'drink', 20000.00, 36, 'chai', '⚡', 'active'),
('s3', 'Nước tăng lực Revive 500ml', 'drink', 15000.00, 42, 'chai', '🔋', 'active'),
('s4', 'Ống cầu lông Hải Yến S90 (12 quả)', 'shuttlecock', 240000.00, 25, 'ống', '🏸', 'active'),
('s5', 'Ống cầu lông Ba Sao Pro (12 quả)', 'shuttlecock', 220000.00, 18, 'ống', '🏸', 'active'),
('s6', 'Thuê vợt Yonex Astrox 88D Play', 'rental', 30000.00, 10, 'cây/ca', '🏸', 'active'),
('s7', 'Thuê vợt Lining Windstorm 72', 'rental', 30000.00, 8, 'cây/ca', '🏸', 'active'),
('s8', 'Quấn cán vợt VS Grip chống trơn', 'gear', 15000.00, 60, 'cái', '🎗️', 'active'),
('s9', 'Khăn lau mồ hôi thể thao Alobo', 'gear', 35000.00, 30, 'cái', '🧣', 'active');

-- Seed Bookings
INSERT INTO bookings (id, user_id, court_id, user_name, user_phone, booking_date, slot_time, hours_count, court_price, services_total, grand_total, payment_method, payment_status, status, note, created_at)
VALUES 
('BK-8841', 'u2', '3', 'Nguyễn Văn An', '0912345678', 'Hôm nay', '18:00 - 20:00', 2.0, 160000.00, 40000.00, 200000.00, 'Chuyển khoản QR', 'paid', 'confirmed', 'Kèm 2 chai Pocari Sweat', '01/10/2026 14:30'),
('BK-8840', 'u3', '1', 'Lê Thị Bích', '0987654321', 'Hôm nay', '19:00 - 21:00', 2.0, 160000.00, 0.00, 160000.00, 'Chuyển khoản QR', 'paid', 'confirmed', 'Lịch sinh hoạt cố định', '01/10/2026 10:15'),
('BK-8839', 'u4', '5', 'Phạm Quốc Cường', '0933445566', 'Ngày mai', '06:00 - 08:00', 2.0, 240000.00, 30000.00, 270000.00, 'Chuyển khoản QR', 'paid', 'pending', 'Sân VIP buổi sáng', '01/10/2026 09:00');

-- Seed Transactions
INSERT INTO transactions (id, booking_id, customer_name, amount, type, method, status, transaction_time, reference_code)
VALUES 
('TXN-9001', 'BK-8841', 'Nguyễn Văn An', 200000.00, 'income', 'Chuyển khoản QR', 'completed', '01/10/2026 14:30', 'MB-QR8841'),
('TXN-9002', 'BK-8840', 'Lê Thị Bích', 160000.00, 'income', 'Chuyển khoản QR', 'completed', '01/10/2026 10:15', 'VCB-QR8840'),
('TXN-9003', 'BK-8839', 'Phạm Quốc Cường', 270000.00, 'income', 'Chuyển khoản QR', 'completed', '01/10/2026 09:00', 'TCB-QR8839');

-- Seed Activity Logs
INSERT INTO activity_logs (id, action, detail, user_name, log_type, log_time)
VALUES 
('L-101', 'Đăng nhập hệ thống', 'Trần Quốc Trung (admin) đã đăng nhập vào hệ thống', 'Trần Quốc Trung', 'security', '1 phút trước'),
('L-102', 'Tạo đơn đặt sân', 'Đơn BK-8841 cho Nguyễn Văn An (Sân 3)', 'Nguyễn Văn An', 'booking', '15 phút trước'),
('L-103', 'Cập nhật trạng thái sân', 'Đổi trạng thái Sân 3 sang Đang sử dụng (in_use)', 'Hệ thống POS', 'court', '20 phút trước');

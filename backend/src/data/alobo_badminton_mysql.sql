-- =============================================================================
-- 🏸 DATABASE SCRIPT: ALOBO BADMINTON COURT MANAGEMENT SYSTEM
-- Thiết kế tối ưu 100% cho: MySQL Server 8.0+ & MySQL Workbench
-- Tác giả: Trần Quốc Trung (24CT1)
-- =============================================================================

-- 1. Khởi tạo Cơ sở dữ liệu với mã hóa UTF-8 tiếng Việt hoàn chỉnh
CREATE DATABASE IF NOT EXISTS `alobo_badminton`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `alobo_badminton`;

-- Tắt kiểm tra khóa ngoại tạm thời để xóa/tạo bảng an toàn khi chạy lại script
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `booking_services`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `courts`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `clubs`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 2. Bảng `users`: Tài khoản người dùng (Admin, Nhân viên, Khách hàng)
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên người dùng',
    `email` VARCHAR(100) NULL UNIQUE COMMENT 'Địa chỉ email đăng nhập',
    `phone` VARCHAR(20) NULL UNIQUE COMMENT 'Số điện thoại',
    `password` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu',
    `role` ENUM('admin', 'staff', 'customer') DEFAULT 'customer' COMMENT 'Vai trò phân quyền',
    `tier` ENUM('Đồng', 'Bạc', 'Vàng', 'Kim Cương') DEFAULT 'Đồng' COMMENT 'Hạng thành viên',
    `total_spent` DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Tổng chi tiêu tích lũy (VNĐ)',
    `bookings_count` INT DEFAULT 0 COMMENT 'Tổng số lần đặt sân',
    `status` ENUM('active', 'locked') DEFAULT 'active' COMMENT 'Trạng thái tài khoản',
    `avatar_url` VARCHAR(255) NULL,
    `joined_date` VARCHAR(30) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Bảng `clubs`: Cụm sân / Câu lạc bộ cầu lông
-- -----------------------------------------------------------------------------
CREATE TABLE `clubs` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL COMMENT 'Tên câu lạc bộ',
    `address` VARCHAR(255) NOT NULL COMMENT 'Địa chỉ chi tiết',
    `district` VARCHAR(100) NULL COMMENT 'Quận/Huyện',
    `city` VARCHAR(100) DEFAULT 'Đà Nẵng' COMMENT 'Thành phố',
    `phone` VARCHAR(20) NULL COMMENT 'Hotline',
    `open_time` VARCHAR(10) DEFAULT '05:00',
    `close_time` VARCHAR(10) DEFAULT '23:00',
    `price_range` VARCHAR(50) NULL,
    `rating` DECIMAL(2, 1) DEFAULT 5.0,
    `review_count` INT DEFAULT 0,
    `image` VARCHAR(255) NULL,
    `amenities` TEXT NULL COMMENT 'Tiện ích câu lạc bộ',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Bảng `courts`: Danh mục sân thi đấu
-- -----------------------------------------------------------------------------
CREATE TABLE `courts` (
    `id` VARCHAR(50) NOT NULL,
    `club_id` VARCHAR(50) NULL COMMENT 'Mã cụm sân trực thuộc',
    `name` VARCHAR(100) NOT NULL COMMENT 'Tên sân (Sân 1, Sân VIP, ...)',
    `type` VARCHAR(100) DEFAULT 'Thảm BWF Tiêu chuẩn',
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 80000.00 COMMENT 'Giá thuê theo giờ (VNĐ)',
    `status` ENUM('available', 'in_use', 'maintenance', 'locked') DEFAULT 'available' COMMENT 'Trạng thái sân real-time',
    `current_guest` VARCHAR(150) NULL COMMENT 'Thông tin khách đang chơi',
    `current_slot` VARCHAR(50) NULL COMMENT 'Khung giờ đang chơi',
    `image` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_courts_status` (`status`),
    CONSTRAINT `fk_courts_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Bảng `services`: Sản phẩm nước uống & phụ kiện bán tại quầy POS
-- -----------------------------------------------------------------------------
CREATE TABLE `services` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL COMMENT 'Tên sản phẩm / dịch vụ',
    `category` VARCHAR(50) NOT NULL COMMENT 'Phân loại: drink, shuttlecock, rental, gear',
    `price` DECIMAL(10, 2) NOT NULL COMMENT 'Đơn giá (VNĐ)',
    `stock` INT NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho',
    `unit` VARCHAR(20) DEFAULT 'chai' COMMENT 'Đơn vị tính',
    `icon` VARCHAR(20) NULL,
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_services_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Bảng `bookings`: Đơn đặt sân (Khách online & Đặt tại quầy POS)
-- -----------------------------------------------------------------------------
CREATE TABLE `bookings` (
    `id` VARCHAR(50) NOT NULL,
    `user_id` VARCHAR(50) NULL COMMENT 'Mã khách hàng',
    `court_id` VARCHAR(50) NOT NULL COMMENT 'Mã sân',
    `user_name` VARCHAR(100) NOT NULL COMMENT 'Tên người đặt',
    `user_phone` VARCHAR(20) NULL COMMENT 'SĐT liên hệ',
    `booking_date` VARCHAR(30) NOT NULL COMMENT 'Ngày thi đấu',
    `slot_time` VARCHAR(50) NOT NULL COMMENT 'Khung giờ thi đấu',
    `hours_count` DECIMAL(3, 1) DEFAULT 1.0 COMMENT 'Số giờ chơi',
    `court_price` DECIMAL(10, 2) NOT NULL COMMENT 'Tiền thuê sân',
    `services_total` DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Tiền dịch vụ đi kèm',
    `grand_total` DECIMAL(10, 2) NOT NULL COMMENT 'Tổng tiền thanh toán',
    `payment_method` VARCHAR(50) DEFAULT 'Chuyển khoản QR' COMMENT 'Hình thức thanh toán',
    `payment_status` ENUM('paid', 'pending', 'refunded') DEFAULT 'paid',
    `status` ENUM('pending', 'confirmed', 'in_use', 'completed', 'cancelled') DEFAULT 'confirmed',
    `note` TEXT NULL COMMENT 'Ghi chú đơn',
    `created_at` VARCHAR(50) NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_bookings_date` (`booking_date`),
    INDEX `idx_bookings_status` (`status`),
    CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_bookings_court` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Bảng `booking_services`: Chi tiết các dịch vụ trong đơn đặt sân
-- -----------------------------------------------------------------------------
CREATE TABLE `booking_services` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `booking_id` VARCHAR(50) NOT NULL,
    `service_id` VARCHAR(50) NOT NULL,
    `service_name` VARCHAR(100) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_bs_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_bs_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Bảng `transactions`: Sổ quỹ dòng tiền thu - chi
-- -----------------------------------------------------------------------------
CREATE TABLE `transactions` (
    `id` VARCHAR(50) NOT NULL,
    `booking_id` VARCHAR(50) NULL,
    `customer_name` VARCHAR(100) NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `type` ENUM('income', 'expense') DEFAULT 'income',
    `method` VARCHAR(50) DEFAULT 'Chuyển khoản QR',
    `status` ENUM('completed', 'pending', 'cancelled') DEFAULT 'completed',
    `transaction_time` VARCHAR(50) NULL,
    `reference_code` VARCHAR(100) NULL,
    `note` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_txn_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Bảng `activity_logs`: Nhật ký kiểm toán & hoạt động hệ thống (Audit Logs)
-- -----------------------------------------------------------------------------
CREATE TABLE `activity_logs` (
    `id` VARCHAR(50) NOT NULL,
    `action` VARCHAR(150) NOT NULL,
    `detail` TEXT NOT NULL,
    `user_name` VARCHAR(100) NOT NULL,
    `log_type` VARCHAR(50) DEFAULT 'system',
    `log_time` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10. DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- =============================================================================

-- Users
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `tier`, `total_spent`, `bookings_count`, `status`, `joined_date`) VALUES
('u1', 'Trần Quốc Trung', 'admin@court.vn', '0905591379', '123456', 'admin', 'Kim Cương', 12500000.00, 48, 'active', '01/01/2024'),
('u2', 'Nguyễn Văn An', 'an.nguyen@gmail.com', '0912345678', '123456', 'customer', 'Vàng', 3600000.00, 18, 'active', '15/02/2024'),
('u3', 'Lê Thị Bích', 'bich.le@gmail.com', '0987654321', '123456', 'customer', 'Bạc', 1800000.00, 8, 'active', '01/03/2024'),
('u4', 'Phạm Quốc Cường', 'cuong.pham@gmail.com', '0933445566', '123456', 'customer', 'Đồng', 600000.00, 3, 'active', '10/03/2024'),
('u5', 'Hoàng Minh Tuấn', 'tuan.hoang@court.vn', '0977889900', '123456', 'staff', 'Đồng', 0.00, 0, 'active', '20/01/2024');

-- Clubs (QT Sport Chain - Alobooking Network)
INSERT INTO `clubs` (`id`, `name`, `address`, `district`, `city`, `phone`, `open_time`, `close_time`, `price_range`, `rating`, `review_count`, `image`, `amenities`) VALUES
('c1', 'QT Sport - Cơ sở 1: Sân Hoa Thiên Lý', '207 Quách Thị Trang, Hòa Xuân, Cẩm Lệ', 'Cẩm Lệ', 'Đà Nẵng', '0905591379', '05:00', '23:00', '60.000 - 120.000đ/h', 4.9, 156, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', 'Thảm BWF Yonex, Máy lạnh, Căng vợt lấy ngay, Nước uống, Bãi đỗ ô tô miễn phí'),
('c2', 'QT Sport - Cơ sở 2: Sân Kỳ Đồng', '93 Kỳ Đồng, Thanh Khê Đông, Thanh Khê', 'Thanh Khê', 'Đà Nẵng', '0905123456', '05:30', '22:30', '50.000 - 100.000đ/h', 4.8, 112, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80', 'Thảm PVC chống trơn, Wifi tốc độ cao, Phòng thay đồ, Căn tin thể thao'),
('c3', 'QT Sport - Cơ sở 3: Sân Sơn Trà Pro', '120 Ngô Quyền, An Hải Bắc, Sơn Trà', 'Sơn Trà', 'Đà Nẵng', '0935888999', '05:00', '23:00', '70.000 - 130.000đ/h', 5.0, 230, 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80', 'Đèn LED chống chói chuẩn BWF, Huấn luyện viên, Shop đồ tập cầu lông, Khán đài VIP'),
('c4', 'QT Sport - Cơ sở 4: ECO Badminton Center', '45 Huỳnh Tấn Phát, Tân Thuận Đông, Quận 7', 'Quận 7', 'TP.HCM', '0909333777', '05:00', '23:30', '70.000 - 140.000đ/h', 4.9, 188, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', 'Thảm Victor Master Pro, Hệ thống quạt làm mát, Tắm nóng lạnh, Bãi giữ xe 100 xe'),
('c5', 'QT Sport - Cơ sở 5: Sky Badminton Club', '18D Cộng Hòa, Phường 4, Tân Bình', 'Tân Bình', 'TP.HCM', '0918224556', '05:30', '23:00', '65.000 - 130.000đ/h', 4.7, 95, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80', 'Thảm Enlio cao cấp, Phòng tắm cá nhân, Nước giải khát thể thao Pocari/Revive'),
('c6', 'QT Sport - Cơ sở 6: CLB Hoàng Văn Thụ', '20 Hoàng Minh Giám, Phường 9, Phú Nhuận', 'Phú Nhuận', 'TP.HCM', '0903667889', '05:00', '22:30', '60.000 - 120.000đ/h', 4.8, 145, 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80', 'Trần cao 11m chuẩn quốc tế, Đèn LED chống lóa, Trọng tài điều hành giải đấu'),
('c7', 'QT Sport - Cơ sở 7: Gia Hân Badminton Arena', '38 Chế Lan Viên, Tây Thạnh, Tân Phú', 'Tân Phú', 'TP.HCM', '0979445667', '05:00', '23:00', '55.000 - 110.000đ/h', 4.6, 82, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', 'Sân thảm đỏ độc quyền, Cho thuê vợt cao cấp, Khu thể lực & khởi động'),
('c8', 'QT Sport - Cơ sở 8: Hồng Châu Sport Club', '56 Phan Đăng Lưu, Phường 5, Bình Thạnh', 'Bình Thạnh', 'TP.HCM', '0938556778', '05:30', '23:00', '65.000 - 135.000đ/h', 4.9, 168, 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80', 'Thảm Yonex chính hãng, Khu vực máy lạnh chờ đấu, Máy căng vợt điện tử');

-- Courts (Danh sách sân thi đấu thuộc chuỗi QT Sport)
INSERT INTO `courts` (`id`, `club_id`, `name`, `type`, `price`, `status`, `current_guest`, `current_slot`, `image`) VALUES
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

-- Services
INSERT INTO `services` (`id`, `name`, `category`, `price`, `stock`, `unit`, `icon`, `status`) VALUES
('s1', 'Nước khoáng Lavie 500ml', 'drink', 10000.00, 48, 'chai', '💧', 'active'),
('s2', 'Nước điện giải Pocari Sweat 500ml', 'drink', 20000.00, 36, 'chai', '⚡', 'active'),
('s3', 'Nước tăng lực Revive 500ml', 'drink', 15000.00, 42, 'chai', '🔋', 'active'),
('s4', 'Ống cầu lông Hải Yến S90 (12 quả)', 'shuttlecock', 240000.00, 25, 'ống', '🏸', 'active'),
('s5', 'Ống cầu lông Ba Sao Pro (12 quả)', 'shuttlecock', 220000.00, 18, 'ống', '🏸', 'active'),
('s6', 'Thuê vợt Yonex Astrox 88D Play', 'rental', 30000.00, 10, 'cây/ca', '🏸', 'active'),
('s7', 'Thuê vợt Lining Windstorm 72', 'rental', 30000.00, 8, 'cây/ca', '🏸', 'active'),
('s8', 'Quấn cán vợt VS Grip chống trơn', 'gear', 15000.00, 60, 'cái', '🎗️', 'active'),
('s9', 'Khăn lau mồ hôi thể thao Alobo', 'gear', 35000.00, 30, 'cái', '🧣', 'active');

-- Bookings
INSERT INTO `bookings` (`id`, `user_id`, `court_id`, `user_name`, `user_phone`, `booking_date`, `slot_time`, `hours_count`, `court_price`, `services_total`, `grand_total`, `payment_method`, `payment_status`, `status`, `note`, `created_at`) VALUES
('BK-8841', 'u2', '3', 'Nguyễn Văn An', '0912345678', 'Hôm nay', '18:00 - 20:00', 2.0, 160000.00, 40000.00, 200000.00, 'Chuyển khoản QR', 'paid', 'confirmed', 'Kèm 2 chai Pocari Sweat', '01/10/2026 14:30'),
('BK-8840', 'u3', '1', 'Lê Thị Bích', '0987654321', 'Hôm nay', '19:00 - 21:00', 2.0, 160000.00, 0.00, 160000.00, 'Chuyển khoản QR', 'paid', 'confirmed', 'Lịch sinh hoạt cố định', '01/10/2026 10:15'),
('BK-8839', 'u4', '5', 'Phạm Quốc Cường', '0933445566', 'Ngày mai', '06:00 - 08:00', 2.0, 240000.00, 30000.00, 270000.00, 'Chuyển khoản QR', 'paid', 'pending', 'Sân VIP buổi sáng', '01/10/2026 09:00');

-- Booking Services Details
INSERT INTO `booking_services` (`booking_id`, `service_id`, `service_name`, `quantity`, `unit_price`, `total_price`) VALUES
('BK-8841', 's2', 'Nước điện giải Pocari Sweat 500ml', 2, 20000.00, 40000.00),
('BK-8839', 's6', 'Thuê vợt Yonex Astrox 88D Play', 1, 30000.00, 30000.00);

-- Transactions
INSERT INTO `transactions` (`id`, `booking_id`, `customer_name`, `amount`, `type`, `method`, `status`, `transaction_time`, `reference_code`) VALUES
('TXN-9001', 'BK-8841', 'Nguyễn Văn An', 200000.00, 'income', 'Chuyển khoản QR', 'completed', '01/10/2026 14:30', 'MB-QR8841'),
('TXN-9002', 'BK-8840', 'Lê Thị Bích', 160000.00, 'income', 'Chuyển khoản QR', 'completed', '01/10/2026 10:15', 'VCB-QR8840'),
('TXN-9003', 'BK-8839', 'Phạm Quốc Cường', 270000.00, 'income', 'Chuyển khoản QR', 'completed', '01/10/2026 09:00', 'TCB-QR8839');

-- Activity Logs
INSERT INTO `activity_logs` (`id`, `action`, `detail`, `user_name`, `log_type`, `log_time`) VALUES
('L-101', 'Đăng nhập hệ thống', 'Trần Quốc Trung (admin) đã đăng nhập vào hệ thống', 'Trần Quốc Trung', 'security', '1 phút trước'),
('L-102', 'Tạo đơn đặt sân', 'Đơn BK-8841 cho Nguyễn Văn An (Sân 3)', 'Nguyễn Văn An', 'booking', '15 phút trước'),
('L-103', 'Cập nhật trạng thái sân', 'Đổi trạng thái Sân 3 sang Đang sử dụng (in_use)', 'Hệ thống POS', 'court', '20 phút trước');

-- =============================================================================
-- 11. CÂU TRUY VẤN KIỂM TRA NHANH (VERIFICATION QUERIES)
-- =============================================================================
SELECT * FROM `users`;
SELECT * FROM `courts`;
SELECT * FROM `bookings`;
SELECT * FROM `services`;
SELECT * FROM `transactions`;

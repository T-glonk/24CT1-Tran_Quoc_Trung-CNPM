# 🏸 Frontend Module - Badminton Court Booking & Management

Ứng dụng di động và web client xây dựng bằng **React Native (Expo)** dành cho hệ thống đặt sân & quản trị thể thao cầu lông **Alobo Sport**.

---

## 📁 Cấu trúc thư mục (`frontend/`)

```
frontend/
├── App.js                      # Entry point chính bọc AppProvider & AppNavigator
└── src/
    ├── api/                    # Tầng giao tiếp REST API (kết nối với backend Express)
    │   ├── apiClient.js        # Axios / Fetch client với base URL và graceful offline fallback
    │   ├── authApi.js          # API đăng nhập, đăng ký, thông tin user
    │   ├── courtApi.js         # API danh sách sân, trạng thái sân, cập nhật giá
    │   ├── bookingApi.js       # API tạo đơn đặt sân, duyệt đơn, hủy đơn
    │   ├── customerApi.js      # API quản lý khách hàng, hội viên, lịch sử đặt
    │   ├── serviceApi.js       # API quản lý dịch vụ bán hàng, kiểm kho
    │   └── reportApi.js        # API thống kê doanh thu, tỷ lệ lấp đầy sân
    │
    ├── constants/              # Biến hằng số, bảng màu và dữ liệu khởi tạo
    │   ├── theme.js            # Hệ thống màu sắc (Alobo Green, Dark Mode), Typography, Spacing
    │   └── initialData.js      # Dữ liệu mẫu khởi tạo đồng bộ
    │
    ├── components/             # Các components dùng lại được chia theo module
    │   ├── common/             # Button, Input, Header, Badge...
    │   ├── auth/               # PhoneInput, FormInput, FieldLabel...
    │   └── map/                # MiniMapWidget (Bản đồ Leaflet Web/Mobile view)
    │
    ├── context/                # Quản lý State toàn cục của ứng dụng
    │   └── AppContext.js       # AppContext & AppProvider cung cấp data và actions
    │
    ├── navigation/             # Điều hướng & Tab bar
    │   ├── AppNavigator.js     # Bộ điều hướng màn hình Auth, Customer & Admin
    │   └── BottomTabBar.js     # Thanh Bottom Navigation hỗ trợ giao diện Khách & Admin Alobo
    │
    └── screens/                # Màn hình chức năng được phân nhóm rõ ràng
        ├── auth/               # Màn hình xác thực
        │   ├── WelcomeScreen.js
        │   ├── LoginScreen.js
        │   └── RegisterScreen.js
        │
        ├── customer/           # 5 Màn hình chức năng dành cho Khách hàng
        │   ├── HomeScreen.js           # Trang chủ với sân gần bạn, khuyến mãi
        │   ├── BookingGridStep.js      # Bước 1: Chọn ngày, giờ và vị trí sân
        │   ├── BookingConfirmStep.js   # Bước 2: Xác nhận thông tin & dịch vụ đi kèm
        │   ├── BookingPaymentStep.js   # Bước 3: Thanh toán chuyển khoản QR tự động
        │   ├── BookingDetailScreen.js  # Chi tiết đơn đặt sân
        │   ├── BookingScreen.js        # Flow quy trình đặt sân 3 bước
        │   ├── MyBookingsScreen.js     # Quản lý đơn đặt sân của tôi
        │   ├── FavoritesScreen.js      # Danh sách cụm sân yêu thích
        │   ├── ExploreScreen.js        # Khám phá các câu lạc bộ nổi bật
        │   └── AccountScreen.js        # Trang thông tin tài khoản & cài đặt
        │
        ├── admin/              # 11 Modules chuẩn nghiệp vụ Alobo Quản Lý Sân
        │   ├── AdminHomeScreen.js          # Tổng quan Dashboard & Thống kê nhanh
        │   ├── AdminCourtsScreen.js        # 2.1 & 2.8: Quản lý danh mục sân & trạng thái real-time
        │   ├── AdminScheduleScreen.js      # 2.2: Lịch đặt sân dạng lưới & Đặt tại quầy POS
        │   ├── AdminBookingsScreen.js      # 2.3: Quản lý & duyệt danh sách đơn đặt sân
        │   ├── AdminUsersScreen.js         # 2.4 & 2.11: Quản lý tài khoản & phân quyền nhân viên
        │   ├── AdminCustomersScreen.js     # 2.5: CRM Quản lý khách hàng & hội viên VIP
        │   ├── AdminServicesScreen.js      # 2.6: Bán hàng POS & Quản lý kho dịch vụ/nước uống
        │   ├── AdminTransactionsScreen.js  # 2.7: Sổ quỹ thu chi & Lịch sử giao dịch
        │   ├── AdminReportsScreen.js       # 2.9 & 2.10: Báo cáo doanh thu & tỷ lệ lấp đầy
        │   ├── AdminSettingsScreen.js      # 2.11: Cài đặt hệ thống & Nhật ký hoạt động Audit Log
        │   └── AdminProfileScreen.js       # Hồ sơ cá nhân quản trị viên & Đăng xuất
        │
        └── map/                # Bản đồ tìm kiếm sân
            └── MapScreen.js            # Tìm sân theo khu vực, lọc khoảng cách và giá
```

---

## 🚀 Hướng dẫn khởi chạy

### Chạy Frontend qua Expo:
```bash
# Ở thư mục gốc dự án:
npm run start:frontend
# hoặc
npm start
```

### Chạy kết nối với Backend Express:
1. Chạy Backend:
```bash
npm run start:backend
# Server chạy tại: http://localhost:5000
```
2. Frontend sẽ tự động kết nối qua `http://localhost:5000/api`. Nếu server backend chưa bật, ứng dụng có cơ chế tự động fallback dùng state cục bộ không làm gián đoạn trải nghiệm người dùng.

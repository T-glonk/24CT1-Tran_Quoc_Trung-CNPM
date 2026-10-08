# -*- coding: utf-8 -*-
"""
Script to generate the complete KhaoSatYeuCau.xlsx for Alobo Badminton Court Booking & Management System
Author: Tran Quoc Trung (24CT1) - Da Nang Architecture University (DAU)
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def create_survey_excel():
    wb = openpyxl.Workbook()
    
    # Remove default sheet
    wb.remove(wb.active)
    
    # Styles Definition
    font_title = Font(name='Arial', size=14, bold=True, color='FFFFFF')
    font_sub_title = Font(name='Arial', size=11, bold=True, color='1E3A8A')
    font_meta_label = Font(name='Arial', size=10, bold=False, color='475569')
    font_tbl_header = Font(name='Arial', size=10, bold=True, color='FFFFFF')
    
    font_data_bold = Font(name='Arial', size=9, bold=True, color='1E293B')
    font_data_regular = Font(name='Arial', size=9, bold=False, color='334155')
    font_data_link = Font(name='Arial', size=9, bold=False, color='2563EB')
    font_badge_high = Font(name='Arial', size=9, bold=True, color='991B1B')
    font_badge_med = Font(name='Arial', size=9, bold=True, color='92400E')
    font_badge_done = Font(name='Arial', size=9, bold=True, color='166534')
    
    fill_navy = PatternFill(start_color='1E3A8A', end_color='1E3A8A', fill_type='solid')
    fill_light_blue = PatternFill(start_color='DBEAFE', end_color='DBEAFE', fill_type='solid')
    fill_light_gray = PatternFill(start_color='F1F5F9', end_color='F1F5F9', fill_type='solid')
    fill_header_slate = PatternFill(start_color='334155', end_color='334155', fill_type='solid')
    
    fill_white = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
    fill_zebra = PatternFill(start_color='F8FAFC', end_color='F8FAFC', fill_type='solid')
    fill_badge_high = PatternFill(start_color='FEE2E2', end_color='FEE2E2', fill_type='solid')
    fill_badge_med = PatternFill(start_color='FEF3C7', end_color='FEF3C7', fill_type='solid')
    fill_badge_done = PatternFill(start_color='DCFCE7', end_color='DCFCE7', fill_type='solid')
    
    thin_border_side = Side(border_style='thin', color='E2E8F0')
    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    
    align_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    align_left = Alignment(horizontal='left', vertical='center', wrap_text=True)
    align_center_nowrap = Alignment(horizontal='center', vertical='center', wrap_text=False)
    align_left_nowrap = Alignment(horizontal='left', vertical='center', wrap_text=False)

    # -------------------------------------------------------------
    # SHEET 0: 0. Tổng Quan & Thống Kê
    # -------------------------------------------------------------
    ws0 = wb.create_sheet(title='0. Tổng Quan & Thống Kê')
    ws0.views.sheetView[0].showGridLines = True
    
    ws0.column_dimensions['A'].width = 4.0
    ws0.column_dimensions['B'].width = 38.0
    ws0.column_dimensions['C'].width = 88.0
    ws0.column_dimensions['D'].width = 12.0
    ws0.column_dimensions['E'].width = 12.0
    ws0.column_dimensions['F'].width = 12.0
    ws0.column_dimensions['G'].width = 12.0
    
    ws0.row_dimensions[2].height = 36.0
    ws0.merge_cells('B2:C2')
    cell_b2 = ws0['B2']
    cell_b2.value = 'BÁO CÁO KHẢO SÁT YÊU CẦU HỆ THỐNG - MÔN CÔNG NGHỆ PHẦN MỀM (CNPM24)'
    cell_b2.font = Font(name='Arial', size=13, bold=True, color='FFFFFF')
    cell_b2.fill = fill_navy
    cell_b2.alignment = align_center_nowrap
    
    overview_data = [
        ("Tên đề tài:", "HỆ THỐNG QUẢN LÝ VÀ ĐẶT SÂN CẦU LÔNG THÔNG MINH (ALOBO SPORT / ALOBO BADMINTON)"),
        ("Môn học:", "Công nghệ phần mềm (CNPM24)"),
        ("Sinh viên thực hiện:", "Trần Quốc Trung"),
        ("Lớp sinh hoạt:", "24CT1"),
        ("Trường đào tạo:", "Đại học Kiến trúc Đà Nẵng (DAU)"),
        ("Giảng viên hướng dẫn:", "Phạm Thị Dung"),
        ("Kiến trúc hệ thống:", "Fullstack 2 Module độc lập: REST API Backend (Node.js/Express) & Client Mobile/Web App (React Native/Expo)"),
        ("Công nghệ Backend:", "Node.js, Express.js RESTful API, JSON Web Token (JWT), Multer, Winston/Logger Middleware"),
        ("Công nghệ Cơ sở dữ liệu:", "MySQL 8.0+ Database kết hợp Kiến trúc Đồng bộ kép Dual-Sync Realtime (MySQL + JSON Engine)"),
        ("Công nghệ Frontend:", "React Native / Expo (Đa nền tảng Web & Mobile), React Navigation, Expo Vector Icons, Responsive UI"),
        ("Tổng số Yêu cầu Chức năng (FR):", "14 Yêu cầu cốt lõi (FR-01 đến FR-14) - Mức ưu tiên: CAO (100%)"),
        ("Tổng số Yêu cầu Phi Chức năng (NFR):", "6 Yêu cầu kỹ thuật (NFR-01 đến NFR-06) - Mức ưu tiên: TRUNG BÌNH & CAO (100%)"),
        ("Cấu trúc bảng đặc tả:", "7 Cột chuẩn: Mã, Tên yêu cầu, Mô tả yêu cầu, Ưu tiên, Tiêu chí nghiệm thu, Link mẫu & Giao diện, Đã hoàn thành"),
        ("Tiến độ hoàn thành dự án:", "100% ĐÃ HOÀN THÀNH (Toàn bộ 14/14 Yêu cầu FR và 6/6 Chỉ tiêu NFR đã cài đặt & kiểm thử)"),
        ("Các link mẫu khảo sát thị trường:", "Playo Sports Booking Platform | OpenSports Venue Manager | Sân Việt / AloboSport VN")
    ]
    
    for idx, (label, val) in enumerate(overview_data, start=4):
        ws0.row_dimensions[idx].height = 24.0
        ws0.cell(row=idx, column=2, value=label)
        ws0.cell(row=idx, column=3, value=val)
        
        ws0.cell(row=idx, column=2).font = Font(name='Arial', size=10, bold=True, color='1E3A8A')
        ws0.cell(row=idx, column=2).fill = fill_light_blue if idx % 2 == 0 else fill_light_gray
        ws0.cell(row=idx, column=2).alignment = Alignment(horizontal='left', vertical='center')
        ws0.cell(row=idx, column=2).border = cell_border
        
        ws0.cell(row=idx, column=3).font = Font(name='Arial', size=10, bold=False, color='1E293B')
        ws0.cell(row=idx, column=3).fill = fill_white if idx % 2 == 0 else fill_zebra
        ws0.cell(row=idx, column=3).alignment = Alignment(horizontal='left', vertical='center')
        ws0.cell(row=idx, column=3).border = cell_border

    # -------------------------------------------------------------
    # SHEET 1: 1. Yêu Cầu Chức Năng (FR)
    # -------------------------------------------------------------
    ws1 = wb.create_sheet(title='1. Yêu Cầu Chức Năng (FR)')
    ws1.views.sheetView[0].showGridLines = True
    
    col_widths_fr = {'A': 12.0, 'B': 30.0, 'C': 46.0, 'D': 14.0, 'E': 68.0, 'F': 42.0, 'G': 20.0}
    for col_letter, width in col_widths_fr.items():
        ws1.column_dimensions[col_letter].width = width
        
    ws1.row_dimensions[1].height = 32.0
    ws1.row_dimensions[2].height = 24.0
    ws1.row_dimensions[3].height = 22.0
    ws1.row_dimensions[5].height = 28.0
    
    ws1.merge_cells('A1:G1')
    ws1['A1'].value = '3.1. GIAI ĐOẠN LẬP KẾ HOẠCH – ĐẶC TẢ YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS - FR)'
    ws1['A1'].font = font_title
    ws1['A1'].fill = fill_navy
    ws1['A1'].alignment = align_center_nowrap
    
    ws1.merge_cells('A2:G2')
    ws1['A2'].value = 'ĐỀ TÀI: HỆ THỐNG QUẢN LÝ VÀ ĐẶT SÂN CẦU LÔNG THÔNG MINH (ALOBO SPORT / ALOBO BADMINTON)'
    ws1['A2'].font = font_sub_title
    ws1['A2'].fill = fill_light_blue
    ws1['A2'].alignment = align_center_nowrap
    
    ws1.merge_cells('A3:G3')
    ws1['A3'].value = 'Sinh viên: Trần Quốc Trung – Lớp: 24CT1 – GV hướng dẫn: Phạm Thị Dung'
    ws1['A3'].font = font_meta_label
    ws1['A3'].fill = fill_light_gray
    ws1['A3'].alignment = align_center_nowrap
    
    headers = ['Mã', 'Tên yêu cầu', 'Mô tả yêu cầu', 'Ưu tiên', 'Tiêu chí nghiệm thu (Acceptance Criteria)', 'Link mẫu (Tham khảo & Giao diện)', 'Đã hoàn thành']
    for c_idx, h in enumerate(headers, start=1):
        cell = ws1.cell(row=5, column=c_idx, value=h)
        cell.font = font_tbl_header
        cell.fill = fill_header_slate
        cell.alignment = align_center
        cell.border = cell_border
        
    fr_list = [
        (
            'FR-01',
            'Xác thực người dùng, Đăng ký/Đăng nhập & Phân quyền đa vai trò',
            'Cung cấp cơ chế xác thực bảo mật, đăng ký tài khoản khách hàng bằng SĐT/Email, đăng nhập phân quyền tự động theo vai trò (Khách hàng customer, Nhân viên staff, Quản trị viên admin).',
            'Cao',
            '- Đăng ký tài khoản mới xác thực họ tên, SĐT 10 số, email hợp lệ, mật khẩu >= 6 ký tự.\n- Đăng nhập xác thực trả về JSON Web Token (JWT) chứa thông tin vai trò và định danh user.\n- Tự động điều hướng thông minh: Admin/Staff vào cụm 11 Module Quản trị, Khách hàng vào giao diện đặt sân.\n- Hỗ trợ ghi nhớ phiên đăng nhập an toàn và đăng xuất xóa phiên làm việc.',
            '• Playo User Auth (https://playo.co/)\n• Màn hình Chào mừng & Đăng nhập (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/auth/LoginScreen.js)\n• Controller Xác thực Auth (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/authController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-02',
            'Khám phá câu lạc bộ, Danh sách cụm sân & Bộ lọc nâng cao',
            'Cho phép khách hàng tìm kiếm, duyệt danh sách và lọc các cụm sân cầu lông theo quận huyện, tiêu chuẩn thảm BWF, khoảng cách gần nhất, đánh giá sao và bảng giá.',
            'Cao',
            '- Hiển thị 8 cụm cơ sở sân (QT Sport / Alobo) kèm hình ảnh chất lượng cao, đánh giá rating, giờ mở cửa và khoảng cách.\n- Bộ lọc Tag động: Chuẩn BWF, Đơn ngày, Sự kiện, Sân VIP thảm đỏ.\n- Tìm kiếm tức thời theo tên cụm sân hoặc địa chỉ (Đà Nẵng, TP.HCM).\n- Hiển thị danh sách sân thuộc cụm cùng giá thuê chi tiết theo giờ.',
            '• OpenSports Venue Search (https://opensports.net/)\n• Màn hình Trang Chủ Khách Hàng (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/customer/HomeScreen.js)\n• API Danh mục Cụm sân (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/courtController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-03',
            'Bản đồ số tương tác tìm kiếm sân theo định vị GPS (Interactive Map)',
            'Cung cấp bản đồ tương tác hiển thị trực quan tọa độ các cơ sở sân cầu lông trên bản đồ, tính toán khoảng cách thực tế và hỗ trợ chỉ đường cho người chơi.',
            'Cao',
            '- Tích hợp widget bản đồ tương tác với các Marker định vị tọa độ thực tế từng cơ sở sân.\n- Khi chọn một Marker: hiển thị Card thông tin tóm tắt gồm ảnh, tên sân, khoảng cách (km) và nút Đặt sân ngay.\n- Tích hợp tìm kiếm cụm sân gần vị trí hiện tại của người chơi.',
            '• Playo Courts Map Finder (https://playo.co/)\n• Màn hình Bản Đồ Vị Trí Sân (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/map/MapScreen.js)\n• Widget Bản đồ Mini (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/components/map/MiniMapWidget.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-04',
            'Ma trận lịch đặt sân trực quan theo thời gian thực (Interactive Court Grid)',
            'Cung cấp ma trận đặt sân trực quan (Sân x Khung giờ từ 05:00 - 23:00) giúp khách hàng dễ dàng theo dõi tình trạng còn trống và chọn slot thuận tiện.',
            'Cao',
            '- Hiển thị lưới ma trận 17 sân theo từng khung giờ trong ngày từ 05:00 đến 23:00.\n- Mã màu phân biệt trực quan: Xanh (Trống / Sẵn sàng), Xám/Đỏ (Đã có người đặt / Đang chơi), Cam (Đang chọn).\n- Cho phép chọn nhiều khung giờ liên tiếp hoặc chọn nhiều sân cùng lúc, tự động tính tổng số giờ đặt.\n- Khóa chọn tức thời các slot đã được đặt trước đó để chống xung đột.',
            '• Sân Việt Booking Grid (https://sanviet.vn/)\n• Giao diện Chọn Sân & Khung Giờ (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/customer/BookingGridStep.js)\n• Dữ liệu Giờ & Trạng thái Sân (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/constants/initialData.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-05',
            'Đặt dịch vụ phụ trợ đi kèm (Nước uống, Thuê vợt, Quả cầu, Phụ kiện)',
            'Trong quy trình đặt sân, khách hàng có thể chọn thêm các dịch vụ tiện ích như nước khoáng, nước điện giải, ống cầu thi đấu, thuê vợt chính hãng trước khi thi đấu.',
            'Cao',
            '- Hiển thị danh mục dịch vụ chia theo nhóm: Nước giải khát (Lavie, Pocari, Revive), Cầu lông (Hải Yến S90, Ba Sao Pro), Thuê vợt (Yonex, Lining), Phụ kiện (Grip, Khăn).\n- Bộ đếm số lượng (+ / -) trực quan, tự động kiểm tra số lượng tồn kho khả dụng.\n- Tự động tính tổng tiền dịch vụ và cộng dồn vào tổng chi phí đơn hàng.',
            '• OpenSports Add-on Amenities (https://opensports.net/)\n• Giao diện Chọn Dịch Vụ Đi Kèm (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/customer/BookingConfirmStep.js)\n• API Quản lý Dịch vụ & Kho (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/serviceController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-06',
            'Cổng thanh toán đa kênh & Sinh mã VietQR chuyển khoản tự động',
            'Tích hợp phương thức thanh toán chuyển khoản qua mã VietQR thông minh, tự động nhúng mã đơn hàng và số tiền chính xác, hỗ trợ VNPay và tiền mặt.',
            'Cao',
            '- Tự động sinh mã VietQR động theo chuẩn Napas247 chứa đúng số tài khoản, số tiền grand_total và cú pháp ALOBOSPORT <Mã Đơn>.\n- Hỗ trợ các nút thao tác nhanh: Tải mã QR và Sao chép số tài khoản / số tiền.\n- Tự động lưu thông tin thanh toán và cập nhật trạng thái đơn sang paid sau khi chuyển khoản thành công.',
            '• VietQR Standard Banking (https://vietqr.net/)\n• Màn hình Thanh Toán QR Thông Minh (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/customer/BookingPaymentStep.js)\n• API Tạo Đơn & Xử lý Thanh toán (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/bookingController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-07',
            'Quản lý vé điện tử, Lịch sử đặt sân & Hủy đơn của khách hàng',
            'Khách hàng dễ dàng tra cứu danh sách vé đã đặt, xem chi tiết hóa đơn điện tử, trạng thái duyệt và thực hiện hủy đơn khi có việc đột xuất theo quy định.',
            'Cao',
            '- Phân loại đơn hàng theo 3 Tab: Sắp tới (Chờ duyệt / Đã duyệt), Đã hoàn thành, Đã hủy.\n- Xem chi tiết đơn: Mã đặt sân, tên cơ sở, số sân, thời gian thi đấu, danh sách dịch vụ, tiền cọc, hotline hỗ trợ.\n- Hỗ trợ nút Hủy đơn có hộp thoại xác nhận; tự động giải phóng slot sân về trạng thái trống khi hủy đơn.',
            '• Playo Pass & Bookings (https://playo.co/)\n• Màn hình Vé Của Tôi (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/customer/MyBookingsScreen.js)\n• Màn hình Chi Tiết Đơn Đặt (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/customer/BookingDetailScreen.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-08',
            'Quản lý danh mục sân thi đấu & Chuyển đổi trạng thái sân Live (Admin)',
            'Quản trị viên quản lý danh sách toàn bộ các sân theo cơ sở, chỉnh sửa đơn giá/loại thảm, và chuyển đổi trạng thái hoạt động tức thì (Trống / Đang chơi / Bảo dưỡng).',
            'Cao',
            '- Hiển thị danh sách sân dạng thẻ trực quan kèm ảnh, đơn giá giờ, loại thảm và trạng thái hiện tại.\n- Thao tác 1 chạm chuyển đổi trạng thái: available (Sẵn sàng) <-> in_use (Đang sử dụng) <-> maintenance (Bảo trì).\n- Thêm mới sân thi đấu, chỉnh sửa giá giờ cao điểm / giờ thường, xóa sân có xác nhận an toàn.',
            '• OpenSports Court Manager (https://opensports.net/)\n• Màn hình Quản Lý Sân Admin (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminCourtsScreen.js)\n• Controller Cập Nhật Trạng Thái Sân (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/courtController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-09',
            'Lịch vận hành thời gian thực & Đặt sân nhanh tại quầy POS (Admin)',
            'Màn hình điều hành bốt lễ tân cho phép xem sơ đồ lấp đầy sân theo trục thời gian và tạo đơn đặt sân nhanh cho khách vãng lai chơi trực tiếp tại sân.',
            'Cao',
            '- Giao diện Timeline Grid hiển thị trực quan các ca chơi trong ngày của từng sân.\n- Modal đặt sân tại quầy: Nhập nhanh tên khách, SĐT, chọn sân, khung giờ, ghi chú và phương thức thanh toán tiền mặt/chuyển khoản.\n- Tự động tạo bản ghi đơn hàng, khóa slot và ghi nhận dòng tiền vào sổ quỹ tức thì.',
            '• Sân Việt POS Station (https://sanviet.vn/)\n• Màn hình Lịch Trực & Đặt Sân POS (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminScheduleScreen.js)\n• API Đặt Sân Quản Trị (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/bookingController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-10',
            'Quy trình phê duyệt, tiếp nhận & Hủy đơn đặt sân tập trung (Admin)',
            'Hệ thống xử lý đơn đặt sân trực tuyến từ khách hàng, cho phép nhân viên duyệt tiếp nhận đơn (confirmed), chuyển trạng thái thi đấu (in_use), hoặc từ chối đơn có lý do.',
            'Cao',
            '- Danh sách đơn đặt phân nhóm: Chờ duyệt (pending), Đã xác nhận (confirmed), Đang chơi (in_use), Hoàn thành (completed), Đã hủy (cancelled).\n- Nút hành động nhanh: Duyệt đơn, Nhận sân thi đấu, Hoàn tất ca, Hủy đơn kèm ghi chú lý do.\n- Tự động cập nhật thời gian thực trên CSDL và đồng bộ sang màn hình khách hàng.',
            '• OpenSports Order Approvals (https://opensports.net/)\n• Màn hình Duyệt Đơn Đặt Sân (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminBookingsScreen.js)\n• Controller Xử Lý Nghiệp Vụ Đơn (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/bookingController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-11',
            'Quản trị Bán hàng Dịch vụ / Phụ kiện & Kiểm soát kho tồn (Admin POS)',
            'Cung cấp màn hình bán lẻ nước uống, thuê vợt và phụ kiện tại quầy lễ tân, hỗ trợ kiểm kê kho hàng, cảnh báo sắp hết hàng và nhập kho bổ sung.',
            'Cao',
            '- Danh mục sản phẩm chia theo nhóm, hiển thị tồn kho hiện tại, đơn giá bán, đơn vị tính.\n- Bán lẻ nhanh tại quầy: Chọn số lượng -> Tính tiền -> Tự động trừ tồn kho CSDL và tạo giao dịch thu.\n- Chức năng Thêm sản phẩm mới, Cập nhật giá bán, Điều chỉnh tồn kho (Nhập/Xuất kho).',
            '• KiotViet Bán Hàng Dịch Vụ (https://www.kiotviet.vn/)\n• Màn hình Quản Lý Dịch Vụ & Kho (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminServicesScreen.js)\n• API Bán hàng & Tồn Kho (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/serviceController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-12',
            'Quản lý Khách hàng, Lịch sử tiêu dùng & Phân hạng Hội viên CRM (Admin)',
            'Hệ thống quản lý toàn diện thông tin khách hàng, thống kê số lượt đặt sân, tổng tiền tích lũy và tự động xếp hạng hội viên (Đồng, Bạc, Vàng, Kim Cương).',
            'Cao',
            '- Bảng dữ liệu CRM hiển thị Họ tên, SĐT, Email, Hạng thẻ, Tổng tiền chi tiêu, Số đơn đặt và ngày tham gia.\n- Bộ lọc theo hạng hội viên (Đồng, Bạc, Vàng, Kim Cương) và tìm kiếm nhanh theo SĐT.\n- Thao tác Chỉnh sửa thông tin, Đổi hạng hội viên, Khóa/Mở khóa tài khoản khách hàng.',
            '• Playo User & Membership CRM (https://playo.co/)\n• Màn hình Quản Trị Khách Hàng CRM (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminCustomersScreen.js)\n• API Quản Lý Khách Hàng (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/customerController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-13',
            'Sổ quỹ thu chi, Quản lý dòng tiền & Đối soát giao dịch tài chính (Admin)',
            'Ghi nhận minh bạch toàn bộ các dòng tiền thu (tiền đặt sân, bán dịch vụ) và các khoản chi vận hành bãi sân, hỗ trợ đối soát mã giao dịch ngân hàng.',
            'Cao',
            '- Thống kê 3 chỉ số tài chính: Tổng Thu, Tổng Chi, và Số Dư Quỹ Thực Tế.\n- Danh sách giao dịch chi tiết: Mã giao dịch (TXN-XXXX), Mã đơn liên kết, Tên khách hàng, Số tiền, Loại (Thu/Chi), Phương thức, Mã tham chiếu.\n- Tạo phiếu thu/chi thủ công và xuất sao kê dòng tiền.',
            '• MISA eShop Quản Lý Sổ Quỹ (https://www.misa.vn/)\n• Màn hình Sổ Quỹ Giao Dịch (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminTransactionsScreen.js)\n• Controller Sổ Quỹ Dòng Tiền (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/transactionController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'FR-14',
            'Dashboard thống kê thông minh, Biểu đồ doanh thu & Báo cáo hiệu suất sân (Admin)',
            'Màn hình trung tâm tổng hợp các chỉ số KPI vận hành, phân tích doanh thu theo ngày/tháng, tỷ lệ lấp đầy sân (Occupancy Rate) và cảnh báo giờ cao điểm.',
            'Cao',
            '- 4 Thẻ KPI tự động cập nhật: Doanh thu hôm nay, Đơn đặt mới chờ duyệt, Tỷ lệ lấp đầy sân (%), Khách hàng mới.\n- Biểu đồ cột / đường trực quan: Doanh thu theo 7 ngày gần nhất và phân tích tỷ trọng theo từng cơ sở cụm sân.\n- Báo cáo phân tích khung giờ cao điểm (Peak Hours: 17:00 - 21:00) giúp chủ sân tối ưu giá và phân bổ nhân sự.',
            '• OpenSports Analytics Dashboard (https://opensports.net/)\n• Màn hình Dashboard Tổng Quan Admin (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminHomeScreen.js)\n• Màn hình Báo Cáo Doanh Thu Chuyên Sâu (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/screens/admin/AdminReportsScreen.js)\n• API Thống Kê & Báo Cáo (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/reportController.js)',
            '[✔] Đã hoàn thành'
        )
    ]
    
    for r_idx, row_data in enumerate(fr_list, start=6):
        ws1.row_dimensions[r_idx].height = 46.0
        is_even = (r_idx % 2 == 0)
        row_fill = fill_zebra if is_even else fill_white
        
        for c_idx, val in enumerate(row_data, start=1):
            cell = ws1.cell(row=r_idx, column=c_idx, value=val)
            cell.border = cell_border
            
            if c_idx == 1: # Mã
                cell.font = font_data_bold
                cell.fill = row_fill
                cell.alignment = align_center
            elif c_idx == 2: # Tên
                cell.font = font_data_bold
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 3: # Mô tả
                cell.font = font_data_regular
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 4: # Ưu tiên
                cell.font = font_badge_high
                cell.fill = fill_badge_high
                cell.alignment = align_center
            elif c_idx == 5: # Tiêu chí
                cell.font = font_data_regular
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 6: # Link mẫu
                cell.font = font_data_link
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 7: # Đã hoàn thành
                cell.font = font_badge_done
                cell.fill = fill_badge_done
                cell.alignment = align_center

    # -------------------------------------------------------------
    # SHEET 2: 2. Yêu Cầu Phi Chức Năng (NFR)
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title='2. Yêu Cầu Phi Chức Năng (NFR)')
    ws2.views.sheetView[0].showGridLines = True
    
    col_widths_nfr = {'A': 12.0, 'B': 28.0, 'C': 45.0, 'D': 14.0, 'E': 65.0, 'F': 38.0, 'G': 20.0}
    for col_letter, width in col_widths_nfr.items():
        ws2.column_dimensions[col_letter].width = width
        
    ws2.row_dimensions[1].height = 32.0
    ws2.row_dimensions[2].height = 24.0
    ws2.row_dimensions[4].height = 28.0
    
    ws2.merge_cells('A1:G1')
    ws2['A1'].value = '3.1. GIAI ĐOẠN LẬP KẾ HOẠCH – ĐẶC TẢ YÊU CẦU PHI CHỨC NĂNG (NFR)'
    ws2['A1'].font = font_title
    ws2['A1'].fill = fill_navy
    ws2['A1'].alignment = align_center_nowrap
    
    ws2.merge_cells('A2:G2')
    ws2['A2'].value = 'TIÊU CHUẨN KỸ THUẬT VỀ HIỆU NĂNG, KIẾN TRÚC DUAL-SYNC, BẢO MẬT & ĐỘ SẴN SÀNG HỆ THỐNG'
    ws2['A2'].font = font_sub_title
    ws2['A2'].fill = fill_light_blue
    ws2['A2'].alignment = align_center_nowrap
    
    for c_idx, h in enumerate(headers, start=1):
        cell = ws2.cell(row=4, column=c_idx, value=h)
        cell.font = font_tbl_header
        cell.fill = fill_header_slate
        cell.alignment = align_center
        cell.border = cell_border
        
    nfr_list = [
        (
            'NFR-01',
            'Hiệu năng & Tốc độ phản hồi API hệ thống',
            'Hệ thống backend RESTful API và cơ chế truy xuất CSDL phải đảm bảo tốc độ phản hồi cực nhanh, không gây trễ khi khách hàng tra cứu hoặc đặt sân đồng thời.',
            'Trung bình',
            '- Thời gian phản hồi API tra cứu danh mục sân, lịch đặt sân <= 150ms trên mạng nội bộ và <= 300ms qua Internet.\n- Thời gian thực thi thao tác tạo đơn và sinh mã VietQR <= 500ms.\n- Khả năng phục vụ đồng thời >= 100 kết nối đặt sân cùng lúc mà không xảy ra nghẽn hàng đợi (queue blocking).',
            '• Fast REST API Specification (https://expressjs.com/)\n• Server Entry Point & Middleware Pipeline (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/server.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'NFR-02',
            'Tính sẵn sàng & Kiến trúc đồng bộ kép (Dual-Sync Architecture)',
            'Hệ thống áp dụng kiến trúc đồng bộ kép giữa MySQL Database và In-Memory/JSON Storage Engine, đảm bảo hệ thống luôn hoạt động mượt mà ngay cả khi MySQL ngắt kết nối.',
            'Trung bình',
            '- Mọi thao tác ghi dữ liệu (đặt sân, đổi trạng thái, bán hàng) được cập nhật tức thời vào RAM/JSON và tự động đồng bộ sang MySQL.\n- Cơ chế Failover thông minh: Nếu MySQL bảo trì, hệ thống tự động chạy trên JSON Storage và nạp lại khi CSDL sẵn sàng.\n- Độ sẵn sàng hệ thống (Uptime) đạt >= 99.8%.',
            '• MySQL In-Memory Dual Engine Pattern (https://dev.mysql.com/)\n• Module Quản Lý Kết Nối & Đồng Bộ CSDL (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/config/db.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'NFR-03',
            'Bảo mật thông tin, Mã hóa mật khẩu & Phân quyền truy cập',
            'Bảo vệ toàn diện thông tin cá nhân khách hàng, số điện thoại, lịch sử giao dịch và phân quyền nghiêm ngặt giữa các tài khoản người dùng.',
            'Trung bình',
            '- Toàn bộ mật khẩu người dùng lưu trữ trong CSDL được băm bảo mật bằng thuật toán mã hóa an toàn (bcrypt/SHA-256).\n- Xác thực API thông qua JWT Token với thời hạn hiệu lực, kiểm tra quyền hạn Admin/Staff bằng middleware authMiddleware.\n- Chống các lỗ hổng bảo mật phổ biến: SQL Injection (tham số hóa câu lệnh), XSS, và CORS Protection.',
            '• JWT Standard Authentication (https://jwt.io/)\n• Middleware Xác Thực & Phân Quyền (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/middlewares/authMiddleware.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'NFR-04',
            'Trải nghiệm người dùng (UX/UI) & Khả năng đáp ứng đa nền tảng',
            'Giao diện người dùng hiện đại theo phong cách Alobo Sport với gam màu thể thao năng động, hỗ trợ hiển thị tối ưu trên cả thiết bị di động (Mobile App) và màn hình trình duyệt (Web/Tablet).',
            'Trung bình',
            '- Thời gian render màn hình ban đầu (First Contentful Paint) < 1.2 giây.\n- Thiết kế chuẩn Design System: Hệ thống màu sắc nhận diện thể thao (Xanh ngọc Sport Green #10B981, Xanh Navy #0F172A), Typography Inter/Roboto rõ nét, bo góc mềm mại, độ tương phản WCAG 2.1 AA.\n- Bố cục thích ứng (Responsive Layout) tự động co giãn linh hoạt trên Mobile (iOS/Android) và Desktop Web.',
            '• Material & Human Interface Design Guidelines\n• Design System Theme Token (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/constants/theme.js)\n• Bộ Thành Phần Giao Diện Tái Sử Dụng (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/frontend/src/components/common/)',
            '[✔] Đã hoàn thành'
        ),
        (
            'NFR-05',
            'Tính toàn vẹn dữ liệu & Cơ chế ngăn ngừa xung đột đặt trùng slot (Concurrency)',
            'Đảm bảo tính nhất quán tuyệt đối của dữ liệu đặt sân, tuyệt đối không để xảy ra tình trạng 2 khách hàng đặt trùng 1 sân trong cùng 1 khung giờ.',
            'Trung bình',
            '- Cơ chế kiểm tra khóa slot nguyên tử (Atomic Slot Check): Kiểm tra xung đột trước khi tạo đơn đặt sân.\n- Nếu slot giờ đã có đơn confirmed hoặc in_use, hệ thống lập tức từ chối yêu cầu đặt trùng và trả về thông báo lỗi rõ ràng.\n- Cơ chế tự động giải phóng slot sân khi đơn hàng bị hủy hoặc quá thời hạn thanh toán (Auto-release expired slots).',
            '• Concurrency Booking Control Pattern\n• Logic Chống Đặt Trùng Khung Giờ (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/controllers/bookingController.js)',
            '[✔] Đã hoàn thành'
        ),
        (
            'NFR-06',
            'Giám sát hệ thống, Ghi vết nhật ký hoạt động (Audit Logging) & Khả năng bảo trì',
            'Ghi nhận chi tiết mọi hành vi quản trị, đăng nhập, thay đổi trạng thái sân và giao dịch tài chính phục vụ công tác đối soát, khắc phục sự cố và bảo trì.',
            'Trung bình',
            '- Toàn bộ các yêu cầu HTTP đều được ghi nhận qua loggerMiddleware (Phương thức, Đường dẫn, Mã trạng thái, Thời gian xử lý).\n- Bảng activity_logs lưu trữ nhật ký hành động kèm định danh nhân sự thực hiện, loại sự kiện (security, booking, court, service) và mốc thời gian.\n- Mã nguồn viết theo mô hình phân lớp chuẩn (MVC / Service-Route-Controller), có tài liệu README và chú thích đầy đủ.',
            '• Express Winston/Morgan Logging Best Practices\n• Middleware Ghi Vết Hoạt Động (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/middlewares/loggerMiddleware.js)\n• Dữ Liệu Nhật Ký Hệ Thống (file:///d:/Code/CNPM/24CT1-Tran_Quoc_Trung/backend/src/data/logs.js)',
            '[✔] Đã hoàn thành'
        )
    ]
    
    for r_idx, row_data in enumerate(nfr_list, start=5):
        ws2.row_dimensions[r_idx].height = 44.0
        is_even = (r_idx % 2 == 0)
        row_fill = fill_zebra if is_even else fill_white
        
        for c_idx, val in enumerate(row_data, start=1):
            cell = ws2.cell(row=r_idx, column=c_idx, value=val)
            cell.border = cell_border
            
            if c_idx == 1:
                cell.font = font_data_bold
                cell.fill = row_fill
                cell.alignment = align_center
            elif c_idx == 2:
                cell.font = font_data_bold
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 3:
                cell.font = font_data_regular
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 4:
                cell.font = font_badge_med
                cell.fill = fill_badge_med
                cell.alignment = align_center
            elif c_idx == 5:
                cell.font = font_data_regular
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 6:
                cell.font = font_data_link
                cell.fill = row_fill
                cell.alignment = align_left
            elif c_idx == 7:
                cell.font = font_badge_done
                cell.fill = fill_badge_done
                cell.alignment = align_center

    # -------------------------------------------------------------
    # SHEET 3: 3. Đối Sánh Thị Trường
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title='3. Đối Sánh Thị Trường')
    ws3.views.sheetView[0].showGridLines = True
    
    ws3.column_dimensions['A'].width = 34.0
    ws3.column_dimensions['B'].width = 28.0
    ws3.column_dimensions['C'].width = 26.0
    ws3.column_dimensions['D'].width = 26.0
    ws3.column_dimensions['E'].width = 26.0
    
    ws3.row_dimensions[1].height = 26.0
    ws3.row_dimensions[3].height = 42.0
    
    ws3.merge_cells('A1:E1')
    ws3['A1'].value = 'BẢNG ĐỐI SÁNH TÍNH NĂNG VỚI CÁC SẢN PHẨM MẪU TRÊN THỊ TRƯỜNG'
    ws3['A1'].font = Font(name='Arial', size=13, bold=True, color='FFFFFF')
    ws3['A1'].fill = fill_navy
    ws3['A1'].alignment = align_center_nowrap
    
    comp_headers = [
        'Tính Năng Nghiệp Vụ',
        'Đề Tài Của Sinh Viên (Alobo Sport)',
        'Playo Sports (Link mẫu (https://playo.co/))',
        'OpenSports (Link mẫu (https://opensports.net/))',
        'Sân Việt / AloboSport (Link mẫu (https://sanviet.vn/))'
    ]
    for c_idx, h in enumerate(comp_headers, start=1):
        cell = ws3.cell(row=3, column=c_idx, value=h)
        cell.font = font_tbl_header
        cell.fill = fill_header_slate
        cell.alignment = align_center
        cell.border = cell_border
        
    comp_data = [
        (
            'Tìm kiếm cụm sân theo Bản đồ số GPS',
            '✅ Có (Map View & Khoảng cách GPS)',
            '✅ Có (Bản đồ toàn cầu)',
            '✅ Có (Bản đồ sự kiện thể thao)',
            '⚠️ Bản đồ cơ bản'
        ),
        (
            'Ma trận chọn sân & khung giờ trực quan (Court Grid)',
            '✅ Có (Lưới ma trận 05:00 - 23:00)',
            '⚠️ Dạng danh sách giờ',
            '✅ Có dạng Timeline Grid',
            '✅ Có ma trận sân'
        ),
        (
            'Quy trình đặt sân 3 bước kèm Dịch vụ phụ trợ',
            '✅ Có (Chọn sân -> Dịch vụ -> QR Pay)',
            '⚠️ Chỉ đặt sân, ít dịch vụ kèm',
            '✅ Có dịch vụ đi kèm',
            '⚠️ Dịch vụ đơn giản'
        ),
        (
            'Thanh toán VietQR động tự động điền tiền & nội dung',
            '✅ Có (VietQR Napas247 + VNPay)',
            '❌ Không có VietQR (Stripe/Card)',
            '❌ Không có VietQR (Stripe/PayPal)',
            '✅ Có QR Chuyển khoản'
        ),
        (
            'Bàn trực điều hành POS & Đặt sân nhanh cho khách',
            '✅ Có (POS Station cho lễ tân bốt trực)',
            '❌ Không có (chỉ có app người chơi)',
            '⚠️ Có giao diện web admin',
            '✅ Có POS tại quầy'
        ),
        (
            'Chuyển đổi trạng thái sân Live (Trống/Đang chơi/Bảo trì)',
            '✅ Có (Đổi trạng thái 1 chạm tức thời)',
            '⚠️ Theo lịch cố định',
            '✅ Có đổi trạng thái',
            '✅ Có đổi trạng thái'
        ),
        (
            'Bán lẻ dịch vụ/phụ kiện & Quản lý kho tồn tự động',
            '✅ Có (Trừ kho tự động + Cảnh báo tồn)',
            '❌ Không có bán phụ kiện',
            '⚠️ Quản lý đơn giản',
            '✅ Có quản lý bán hàng'
        ),
        (
            'CRM Khách hàng & Phân hạng hội viên (Đồng/Bạc/Vàng/Kim Cương)',
            '✅ Có (Tự động tích điểm & nâng hạng)',
            '⚠️ Chỉ có điểm danh tiếng',
            '⚠️ Phân nhóm thành viên',
            '⚠️ Quản lý danh bạ khách'
        ),
        (
            'Sổ quỹ dòng tiền thu chi & Đối soát giao dịch tài chính',
            '✅ Có (Quản lý thu/chi + Mã tham chiếu)',
            '⚠️ Báo cáo doanh thu thanh toán',
            '⚠️ Báo cáo qua Stripe',
            '✅ Có sổ quỹ thu chi'
        ),
        (
            'Dashboard thống kê doanh thu & Tỷ lệ lấp đầy sân (Occupancy)',
            '✅ Có (KPIs + Biểu đồ + Giờ cao điểm)',
            '⚠️ Báo cáo cơ bản',
            '✅ Có biểu đồ Analytics',
            '✅ Có báo cáo doanh thu'
        ),
        (
            'Kiến trúc dữ liệu & Nền tảng triển khai',
            '✅ Fullstack React Native + Node.js + Dual-Sync MySQL',
            '☁️ Cloud Native (Mobile App)',
            '☁️ Cloud SaaS (Web/Mobile)',
            '🖥️ Web App / Cloud Server'
        )
    ]
    
    for r_idx, row_data in enumerate(comp_data, start=4):
        ws3.row_dimensions[r_idx].height = 28.0
        is_even = (r_idx % 2 == 0)
        row_fill = fill_zebra if is_even else fill_white
        
        for c_idx, val in enumerate(row_data, start=1):
            cell = ws3.cell(row=r_idx, column=c_idx, value=val)
            cell.border = cell_border
            cell.fill = row_fill
            
            if c_idx == 1:
                cell.font = font_data_bold
                cell.alignment = align_left
            elif c_idx == 2:
                cell.font = Font(name='Arial', size=9, bold=True, color='047857')
                cell.alignment = align_left
            else:
                cell.font = font_data_regular
                cell.alignment = align_left

    # Save to file
    output_path = r'D:\Code\CNPM\24CT1-Tran_Quoc_Trung\KhaoSatYeuCau.xlsx'
    wb.save(output_path)
    print(f'Successfully generated {output_path}')

if __name__ == '__main__':
    create_survey_excel()

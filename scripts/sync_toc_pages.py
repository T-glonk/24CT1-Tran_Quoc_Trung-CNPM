# -*- coding: utf-8 -*-
import re

toc_items = [
    ('LỜI MỞ ĐẦU', 4, 0, True),
    ('CHƯƠNG 1: TỔNG QUAN CƠ SỞ LÝ THUYẾT', 5, 0, True),
    ('1.1. Framework cài đặt', 5, 20, False),
    ('1.1.1. Tổng quan về React Native & Expo', 5, 40, False),
    ('1.1.2. Framework Backend Node.js & Express RESTful API', 7, 40, False),
    ('1.2. Các Công cụ (Tools) hỗ trợ', 7, 20, False),
    ('1.2.1. Antigravity IDE - Môi trường phát triển tích hợp (IDE)', 7, 40, False),
    ('1.2.2. Draw.io (diagrams.net) - Thiết kế mô hình hóa phần mềm', 7, 40, False),
    ('1.2.3. MySQL Workbench & XAMPP - Quản trị CSDL quan hệ', 8, 40, False),
    ('1.2.4. Postman - Kiểm thử và thiết kế API', 8, 40, False),
    ('1.2.5. Git & GitHub - Quản lý phiên bản mã nguồn phân tán', 8, 40, False),
    ('1.2.6. Trello - Quản lý tiến độ dự án theo phương pháp Agile/Kanban', 8, 40, False),
    ('1.3. Ngôn ngữ lập trình & Cấu trúc dự án', 8, 20, False),
    ('1.3.1. Ngôn ngữ lập trình JavaScript & SQL', 8, 40, False),
    ('1.3.2. Cấu trúc thư mục dự án và môi trường cài đặt', 9, 40, False),
    ('CHƯƠNG 2: THỰC NGHIỆM', 10, 0, True),
    ('2.1. Sơ đồ tuần tự (Sequence Diagram) & Sơ đồ luồng (Flowchart)', 10, 20, False),
    ('2.1.1. Sơ đồ tuần tự và Sơ đồ luồng chức năng Đăng ký', 11, 40, False),
    ('2.1.2. Sơ đồ tuần tự và Sơ đồ luồng chức năng Đăng nhập', 12, 40, False),
    ('2.1.3. Sơ đồ tuần tự và Sơ đồ luồng chức năng Tự chọn 1: Đặt sân & Thanh toán VietQR', 13, 40, False),
    ('2.1.4. Sơ đồ tuần tự chức năng Tự chọn 2: Quản lý & Cập nhật đơn đặt sân Chủ sân', 14, 40, False),
    ('2.2. Sơ đồ Pert (PERT Chart) & Đường găng (Critical Path)', 15, 20, False),
    ('2.2.1. Phương pháp luận mạng PERT và giải thuật CPM', 15, 40, False),
    ('2.2.2. Bảng phân rã công việc (WBS) và tính toán tham số thời gian', 15, 40, False),
    ('2.2.3. Sơ đồ mạng PERT học thuật và phân tích đường găng', 17, 40, False),
    ('2.2.4. Ý nghĩa quản trị tiến độ và kiểm soát rủi ro dự án', 17, 40, False),
    ('2.3. Demo', 19, 20, False),
    ('2.3.0. Tổng quan Bảng điều khiển & Khám phá cụm sân (Home & Map View)', 19, 40, False),
    ('2.3.1. Giao diện chức năng Đăng ký', 21, 40, False),
    ('2.3.2. Giao diện chức năng Đăng nhập', 23, 40, False),
    ('2.3.3. Giao diện chức năng Tự chọn 1: Chọn sân & Đặt lịch thi đấu kèm Thanh toán VietQR', 25, 40, False),
    ('2.3.4. Giao diện chức năng Tự chọn 2: Quản lý và theo dõi lịch đặt sân của khách hàng & chủ sân', 28, 40, False),
    ('2.4. Dữ liệu (Database)', 30, 20, False),
    ('2.4.1. Giới thiệu tổng quan hệ CSDL quan hệ MySQL', 30, 40, False),
    ('2.4.2. Thiết kế cấu trúc cơ sở dữ liệu (Sơ đồ ERD & Data Dictionary)', 30, 40, False),
    ('2.4.3. Các tập dữ liệu thực nghiệm trong hệ thống', 36, 40, False),
]

figures_items = [
    ('Hình 1: Sơ đồ tuần tự (Sequence Diagram) chức năng Đăng ký tài khoản người dùng', 11),
    ('Hình 2: Sơ đồ luồng (Flowchart) chức năng Đăng ký tài khoản', 11),
    ('Hình 3: Sơ đồ tuần tự (Sequence Diagram) chức năng Đăng nhập hệ thống đa vai trò', 12),
    ('Hình 4: Sơ đồ luồng (Flowchart) chức năng Đăng nhập hệ thống', 12),
    ('Hình 5: Sơ đồ tuần tự (Sequence Diagram) chức năng Đặt sân & Thanh toán VietQR Người dùng', 13),
    ('Hình 6: Sơ đồ luồng (Flowchart) chức năng Đặt sân & Thanh toán trực tuyến', 13),
    ('Hình 7: Sơ đồ tuần tự (Sequence Diagram) chức năng Quản lý & Cập nhật trạng thái đơn đặt sân Chủ sân', 14),
    ('Hình 8: Sơ đồ mạng PERT học thuật và xác định Đường găng (Critical Path)', 17),
    ('Hình 9: Phác thảo Wireframe sơ bộ Bảng điều khiển tổng quan Trang chủ', 19),
    ('Hình 10: Kết quả thực hiện thực tế Giao diện Bản đồ định vị cụm sân', 20),
    ('Hình 11: Phác thảo Wireframe sơ bộ giao diện Đăng ký tài khoản', 21),
    ('Hình 12: Kết quả thực hiện thực tế giao diện Đăng ký tài khoản di động', 22),
    ('Hình 13: Phác thảo Wireframe sơ bộ giao diện Đăng nhập hệ thống', 23),
    ('Hình 14: Kết quả thực hiện thực tế giao diện Đăng nhập hệ thống đa vai trò', 24),
    ('Hình 15: Phác thảo Wireframe sơ bộ giao diện Đặt sân và Xác nhận thanh toán', 25),
    ('Hình 16: Kết quả thực hiện thực tế giao diện Chọn sân & Đặt lịch thi đấu', 26),
    ('Hình 17: Kết quả thực hiện thực tế giao diện Xác nhận và Thanh toán VietQR', 27),
    ('Hình 18: Phác thảo Wireframe sơ bộ giao diện Quản lý lịch đặt sân', 28),
    ('Hình 19: Kết quả thực hiện thực tế giao diện Quản lý lịch đặt sân đã đặt', 29),
    ('Hình 20: Sơ đồ cấu trúc Cơ sở dữ liệu quan hệ (ERD) toàn hệ thống đặt sân', 31),
]

tables_items = [
    ('Bảng 1: Bảng phân rã công việc (WBS) và tính toán tham số thời gian PERT / CPM', 15),
    ('Bảng 2: Từ điển dữ liệu bảng users (Tài khoản người dùng)', 31),
    ('Bảng 3: Từ điển dữ liệu bảng clubs (Cụm sân cầu lông / Chi nhánh)', 33),
    ('Bảng 4: Từ điển dữ liệu bảng courts (Danh mục sân cầu lông)', 33),
    ('Bảng 5: Từ điển dữ liệu bảng bookings (Đơn đặt sân)', 34),
    ('Bảng 6: Từ điển dữ liệu bảng services (Danh mục sản phẩm, nước uống & phụ kiện)', 34),
    ('Bảng 7: Từ điển dữ liệu bảng booking_services (Chi tiết dịch vụ đi kèm đơn đặt)', 34),
    ('Bảng 8: Tập dữ liệu thực nghiệm bảng users', 36),
    ('Bảng 9: Tập dữ liệu thực nghiệm bảng clubs', 36),
    ('Bảng 10: Tập dữ liệu thực nghiệm bảng courts', 37),
    ('Bảng 11: Tập dữ liệu thực nghiệm bảng bookings', 37),
    ('Bảng 12: Tập dữ liệu thực nghiệm bảng services', 37),
]

def render_toc(items):
    out = []
    for title, page, pad, bold in items:
        style_title = f'padding-left: {pad}px;'
        if bold:
            style_title += ' font-weight: bold;'
        out.append(f'  <div class="toc-item"><span class="toc-text" style="{style_title}">{title}</span><span class="toc-dots"></span><span class="toc-page">{page}</span></div>')
    return '\n'.join(out)

def render_list(items):
    out = []
    for title, page in items:
        out.append(f'  <div class="toc-item"><span class="toc-text">{title}</span><span class="toc-dots"></span><span class="toc-page">{page}</span></div>')
    return '\n'.join(out)

toc_html = render_toc(toc_items)
figs_html = render_list(figures_items)
tabs_html = render_list(tables_items)

new_prelim_section = f"""<!-- MỤC LỤC & DANH MỤC -->
<div class="page-break"></div>

<h1 style="margin-top: 10px; margin-bottom: 15px;">MỤC LỤC</h1>
<div class="toc-container">
{toc_html}
</div>

<div class="page-break"></div>

<h2 class="no-indent" style="text-align: center; color: #1E3A8A; margin-top: 10px; margin-bottom: 15px;">DANH MỤC HÌNH ẢNH</h2>
<div class="toc-container">
{figs_html}
</div>

<h2 class="no-indent" style="text-align: center; color: #1E3A8A; margin-top: 25px; margin-bottom: 15px;">DANH MỤC BẢNG BIỂU</h2>
<div class="toc-container">
{tabs_html}
</div>

<div class="page-break"></div>
"""

with open('report_template.html', 'r', encoding='utf-8') as f:
    tpl = f.read()

start_marker = '<!-- MỤC LỤC & DANH MỤC -->'
end_marker = '<h1>LỜI MỞ ĐẦU</h1>'

p1 = tpl.find(start_marker)
p2 = tpl.find(end_marker)

if p1 != -1 and p2 != -1:
    tpl = tpl[:p1] + new_prelim_section + tpl[p2:]
    print("Replaced entire prelims successfully!")
else:
    print(f"Error: markers not found p1={p1}, p2={p2}")

with open('report_template.html', 'w', encoding='utf-8') as f:
    f.write(tpl)
print("Saved report_template.html")

# -*- coding: utf-8 -*-
import os, sys, base64, subprocess, shutil

# 1. Update report_template.html with:
# - Dot leaders for MỤC LỤC, DANH MỤC HÌNH ẢNH, DANH MỤC BẢNG BIỂU
# - 3 flowcharts inserted into 2.1.1, 2.1.2, 2.1.3
# - Figure numbering updated to 20 figures

toc_items = [
    ("LỜI MỞ ĐẦU", 3, 0, True),
    ("CHƯƠNG 1: TỔNG QUAN CƠ SỞ LÝ THUYẾT", 4, 0, True),
    ("1.1. Framework cài đặt", 4, 20, False),
    ("1.1.1. Tổng quan về React Native & Expo", 4, 40, False),
    ("1.1.2. Framework Backend Node.js & Express RESTful API", 6, 40, False),
    ("1.2. Các Công cụ (Tools) hỗ trợ", 6, 20, False),
    ("1.2.1. Antigravity IDE - Môi trường phát triển tích hợp (IDE)", 6, 40, False),
    ("1.2.2. Draw.io (diagrams.net) - Thiết kế mô hình hóa phần mềm", 7, 40, False),
    ("1.2.3. MySQL Workbench & XAMPP - Quản trị CSDL quan hệ", 7, 40, False),
    ("1.2.4. Postman - Kiểm thử và thiết kế API", 7, 40, False),
    ("1.2.5. Git & GitHub - Quản lý phiên bản mã nguồn phân tán", 8, 40, False),
    ("1.2.6. Trello - Quản lý tiến độ dự án theo phương pháp Agile/Kanban", 8, 40, False),
    ("1.3. Ngôn ngữ lập trình & Cấu trúc dự án", 8, 20, False),
    ("1.3.1. Ngôn ngữ lập trình JavaScript & SQL", 8, 40, False),
    ("1.3.2. Cấu trúc thư mục dự án và môi trường cài đặt", 9, 40, False),
    ("CHƯƠNG 2: THỰC NGHIỆM", 10, 0, True),
    ("2.1. Sơ đồ tuần tự (Sequence Diagram) & Sơ đồ luồng (Flowchart)", 10, 20, False),
    ("2.1.1. Sơ đồ luồng & Sơ đồ tuần tự chức năng Đăng ký", 10, 40, False),
    ("2.1.2. Sơ đồ luồng & Sơ đồ tuần tự chức năng Đăng nhập", 12, 40, False),
    ("2.1.3. Sơ đồ luồng & Sơ đồ tuần tự Tự chọn 1: Đặt sân & Thanh toán VietQR", 14, 40, False),
    ("2.1.4. Sơ đồ tuần tự chức năng Tự chọn 2: Quản lý & Cập nhật đơn đặt sân Chủ sân", 16, 40, False),
    ("2.2. Sơ đồ Pert (PERT Chart) & Đường găng (Critical Path)", 17, 20, False),
    ("2.2.1. Phương pháp luận mạng PERT và giải thuật CPM", 17, 40, False),
    ("2.2.2. Bảng phân rã công việc (WBS) và tính toán tham số thời gian", 17, 40, False),
    ("2.2.3. Sơ đồ mạng PERT học thuật và phân tích đường găng", 18, 40, False),
    ("2.2.4. Ý nghĩa quản trị tiến độ và kiểm soát rủi ro dự án", 19, 40, False),
    ("2.3. Demo", 20, 20, False),
    ("2.3.0. Tổng quan Bảng điều khiển & Khám phá cụm sân (Home & Map View)", 20, 40, False),
    ("2.3.1. Giao diện chức năng Đăng ký", 21, 40, False),
    ("2.3.2. Giao diện chức năng Đăng nhập", 22, 40, False),
    ("2.3.3. Giao diện chức năng Tự chọn 1: Chọn sân & Đặt lịch thi đấu kèm Thanh toán VietQR", 23, 40, False),
    ("2.3.4. Giao diện chức năng Tự chọn 2: Quản lý và theo dõi lịch đặt sân của khách hàng & chủ sân", 25, 40, False),
    ("2.4. Dữ liệu (Database)", 26, 20, False),
    ("2.4.1. Giới thiệu tổng quan hệ CSDL quan hệ MySQL", 26, 40, False),
    ("2.4.2. Thiết kế cấu trúc cơ sở dữ liệu (Sơ đồ ERD & Data Dictionary)", 26, 40, False),
    ("2.4.3. Các tập dữ liệu thực nghiệm trong hệ thống", 30, 40, False),
]

figures_items = [
    ("Hình 1: Sơ đồ luồng (Flowchart) chức năng Đăng ký tài khoản", 10),
    ("Hình 2: Sơ đồ tuần tự (Sequence Diagram) chức năng Đăng ký tài khoản người dùng", 11),
    ("Hình 3: Sơ đồ luồng (Flowchart) chức năng Đăng nhập hệ thống", 12),
    ("Hình 4: Sơ đồ tuần tự (Sequence Diagram) chức năng Đăng nhập hệ thống đa vai trò", 13),
    ("Hình 5: Sơ đồ luồng (Flowchart) chức năng Đặt sân & Thanh toán trực tuyến", 14),
    ("Hình 6: Sơ đồ tuần tự (Sequence Diagram) chức năng Đặt sân & Thanh toán VietQR Người dùng", 15),
    ("Hình 7: Sơ đồ tuần tự (Sequence Diagram) chức năng Quản lý & Cập nhật trạng thái đơn đặt sân Chủ sân", 16),
    ("Hình 8: Sơ đồ mạng PERT học thuật và xác định Đường găng (Critical Path)", 18),
    ("Hình 9: Phác thảo Wireframe sơ bộ Bảng điều khiển tổng quan Trang chủ", 20),
    ("Hình 10: Kết quả thực hiện thực tế Giao diện Bản đồ định vị cụm sân", 20),
    ("Hình 11: Phác thảo Wireframe sơ bộ giao diện Đăng ký tài khoản", 21),
    ("Hình 12: Kết quả thực hiện thực tế giao diện Đăng ký tài khoản di động", 21),
    ("Hình 13: Phác thảo Wireframe sơ bộ giao diện Đăng nhập hệ thống", 22),
    ("Hình 14: Kết quả thực hiện thực tế giao diện Đăng nhập hệ thống đa vai trò", 22),
    ("Hình 15: Phác thảo Wireframe sơ bộ giao diện Đặt sân và Xác nhận thanh toán", 23),
    ("Hình 16: Kết quả thực hiện thực tế giao diện Chọn sân & Đặt lịch thi đấu", 24),
    ("Hình 17: Kết quả thực hiện thực tế giao diện Xác nhận và Thanh toán VietQR", 24),
    ("Hình 18: Phác thảo Wireframe sơ bộ giao diện Quản lý lịch đặt sân", 25),
    ("Hình 19: Kết quả thực hiện thực tế giao diện Quản lý lịch đặt sân đã đặt", 25),
    ("Hình 20: Sơ đồ cấu trúc Cơ sở dữ liệu quan hệ (ERD) toàn hệ thống đặt sân", 27),
]

tables_items = [
    ("Bảng 1: Bảng phân rã công việc (WBS) và tính toán tham số thời gian PERT / CPM", 18),
    ("Bảng 2: Từ điển dữ liệu bảng users (Tài khoản người dùng)", 27),
    ("Bảng 3: Từ điển dữ liệu bảng clubs (Cụm sân cầu lông / Chi nhánh)", 28),
    ("Bảng 4: Từ điển dữ liệu bảng courts (Danh mục sân cầu lông)", 28),
    ("Bảng 5: Từ điển dữ liệu bảng bookings (Đơn đặt sân)", 29),
    ("Bảng 6: Từ điển dữ liệu bảng services (Danh mục sản phẩm, nước uống & phụ kiện)", 29),
    ("Bảng 7: Từ điển dữ liệu bảng booking_services (Chi tiết dịch vụ đi kèm đơn đặt)", 30),
    ("Bảng 8: Tập dữ liệu thực nghiệm bảng users", 30),
    ("Bảng 9: Tập dữ liệu thực nghiệm bảng clubs", 31),
    ("Bảng 10: Tập dữ liệu thực nghiệm bảng courts", 31),
    ("Bảng 11: Tập dữ liệu thực nghiệm bảng bookings", 32),
    ("Bảng 12: Tập dữ liệu thực nghiệm bảng services", 32),
]

def render_toc(items):
    out = []
    for title, page, pad, bold in items:
        style_title = f"padding-left: {pad}px;"
        if bold:
            style_title += " font-weight: bold;"
        out.append(f'  <div class="toc-item"><span class="toc-text" style="{style_title}">{title}</span><span class="toc-dots"></span><span class="toc-page">{page}</span></div>')
    return "\n".join(out)

def render_list(items):
    out = []
    for title, page in items:
        out.append(f'  <div class="toc-item"><span class="toc-text">{title}</span><span class="toc-dots"></span><span class="toc-page">{page}</span></div>')
    return "\n".join(out)

toc_html = render_toc(toc_items)
figs_html = render_list(figures_items)
tabs_html = render_list(tables_items)

print("Generated TOC and Lists HTML.")

# Read current report_template.html
with open("report_template.html", "r", encoding="utf-8") as f:
    tpl = f.read()

# Add CSS for .toc-item if not present
toc_css = """
  .toc-item {
    display: flex;
    align-items: baseline;
    margin: 5px 0;
    font-size: 11.5pt;
    line-height: 1.5;
  }
  .toc-text {
    flex-shrink: 0;
    max-width: 86%;
  }
  .toc-dots {
    flex-grow: 1;
    border-bottom: 1.5px dotted #64748B;
    margin: 0 6px 3px 6px;
  }
  .toc-page {
    flex-shrink: 0;
    min-width: 20px;
    text-align: right;
    font-weight: bold;
  }
"""

if ".toc-dots" not in tpl:
    tpl = tpl.replace("</style>", toc_css + "\n</style>")

# Replace TOC table with toc_html
import re
# Replace MỤC LỤC
pattern_toc = r"<h1>MỤC LỤC</h1>\s*<table[^>]*>.*?</table>"
replacement_toc = f"<h1>MỤC LỤC</h1>\n<div class=\"toc-container\">\n{toc_html}\n</div>"
tpl = re.sub(pattern_toc, replacement_toc, tpl, flags=re.DOTALL)

# Replace DANH MỤC HÌNH ẢNH
pattern_figs = r"<h2 class=\"no-indent\"[^>]*>DANH MỤC HÌNH ẢNH</h2>\s*<table[^>]*>.*?</table>"
replacement_figs = f"<h2 class=\"no-indent\" style=\"text-align: center; color: #1E3A8A;\">DANH MỤC HÌNH ẢNH</h2>\n<div class=\"toc-container\">\n{figs_html}\n</div>"
tpl = re.sub(pattern_figs, replacement_figs, tpl, flags=re.DOTALL)

# Replace DANH MỤC BẢNG BIỂU
pattern_tabs = r"<h2 class=\"no-indent\"[^>]*>DANH MỤC BẢNG BIỂU</h2>\s*<table[^>]*>.*?</table>"
replacement_tabs = f"<h2 class=\"no-indent\" style=\"text-align: center; color: #1E3A8A; margin-top: 30px;\">DANH MỤC BẢNG BIỂU</h2>\n<div class=\"toc-container\">\n{tabs_html}\n</div>"
tpl = re.sub(pattern_tabs, replacement_tabs, tpl, flags=re.DOTALL)

# Update Section 2.1 headings and insert Flowcharts
# 2.1.1 Đăng ký
sec_211 = """<h3>2.1.1. Sơ đồ tuần tự chức năng Đăng ký</h3>
<p><strong>Tác nhân tham gia:</strong> Khách hàng mới (Customer), Giao diện đăng ký (<code>RegisterScreen</code>), Bộ điều khiển xác thực (<code>AuthController</code>) và Bảng dữ liệu người dùng (<code>Users Table</code>).</p>
<p><strong>Mô tả luồng xử lý:</strong> Khách hàng nhập thông tin gồm Họ tên, Số điện thoại, Email và Mật khẩu. Giao diện thực hiện kiểm tra tính hợp lệ cơ bản tại máy khách (Client-side validation) rồi gửi yêu cầu HTTP POST <code>/api/auth/register</code> đến máy chủ. Controller kiểm tra sự tồn tại của số điện thoại và email trong CSDL MySQL. Nếu dữ liệu hợp lệ và chưa từng được đăng ký, máy chủ tiến hành băm mật khẩu bảo mật (Bcrypt), khởi tạo bản ghi mới với vai trò <code>customer</code>, lưu xuống MySQL và trả về thông báo tạo tài khoản thành công kèm điều hướng về màn hình Đăng nhập.</p>

<div class="figure-box">
  <img src="__LUONG_DANGKY__" alt="Sơ đồ luồng chức năng Đăng ký">
  <div class="figure-caption">Hình 1: Sơ đồ luồng (Flowchart) chức năng Đăng ký tài khoản</div>
</div>

<div class="figure-box">
  <img src="__SEQ_DANGKY__" alt="Sơ đồ tuần tự chức năng Đăng ký">
  <div class="figure-caption">Hình 2: Sơ đồ tuần tự (Sequence Diagram) chức năng Đăng ký tài khoản người dùng</div>
</div>"""

pattern_211 = r"<h3>2\.1\.1\. Sơ đồ tuần tự chức năng Đăng ký</h3>.*?<div class=\"figure-caption\">Hình 1: Sơ đồ tuần tự chức năng Đăng ký.*?</div>\s*</div>"
tpl = re.sub(pattern_211, sec_211, tpl, flags=re.DOTALL)

# 2.1.2 Đăng nhập
sec_212 = """<h3>2.1.2. Sơ đồ tuần tự chức năng Đăng nhập</h3>
<p><strong>Tác nhân tham gia:</strong> Người dùng (User), Màn hình đăng nhập (<code>LoginScreen</code>), Bộ điều khiển xác thực (<code>AuthController</code>) và Bảng dữ liệu người dùng (<code>Users Table</code>).</p>
<p><strong>Mô tả luồng xử lý:</strong> Người dùng nhập Số điện thoại hoặc Email cùng Mật khẩu. Giao diện gửi yêu cầu HTTP POST <code>/api/auth/login</code> đến máy chủ. Controller truy vấn CSDL để tìm kiếm người dùng theo định danh tài khoản. Nếu tìm thấy và mật khẩu khớp với chuỗi băm lưu trữ, hệ thống khởi tạo chuỗi mã thông báo JSON Web Token (JWT) có hiệu lực 7 ngày chứa thông tin định danh và phân quyền vai trò (Role: <code>admin</code>, <code>staff</code> hoặc <code>customer</code>). Phía ứng dụng di động lưu JWT vào bộ nhớ bảo mật và Context API, tự động điều hướng người dùng đến giao diện tương ứng theo quyền hạn.</p>

<div class="figure-box">
  <img src="__LUONG_DANGNHAP__" alt="Sơ đồ luồng chức năng Đăng nhập">
  <div class="figure-caption">Hình 3: Sơ đồ luồng (Flowchart) chức năng Đăng nhập hệ thống</div>
</div>

<div class="figure-box">
  <img src="__SEQ_DANGNHAP__" alt="Sơ đồ tuần tự chức năng Đăng nhập">
  <div class="figure-caption">Hình 4: Sơ đồ tuần tự (Sequence Diagram) chức năng Đăng nhập hệ thống đa vai trò</div>
</div>"""

pattern_212 = r"<h3>2\.1\.2\. Sơ đồ tuần tự chức năng Đăng nhập</h3>.*?<div class=\"figure-caption\">Hình 2: Sơ đồ tuần tự chức năng Đăng nhập.*?</div>\s*</div>"
tpl = re.sub(pattern_212, sec_212, tpl, flags=re.DOTALL)

# 2.1.3 Tự chọn 1
sec_213 = """<h3>2.1.3. Sơ đồ tuần tự chức năng Tự chọn 1: Đặt sân & Thanh toán VietQR Người dùng</h3>
<p><strong>Tác nhân tham gia:</strong> Khách hàng (Customer), Màn hình đặt sân (<code>BookingGridStep</code>), Màn hình thanh toán (<code>BookingPaymentStep</code>), Bộ điều khiển đặt sân (<code>BookingController</code>), CSDL MySQL (<code>Bookings & Courts Table</code>) và Cổng thanh toán VietQR.</p>
<p><strong>Mô tả luồng xử lý:</strong> Khách hàng chọn cơ sở sân, ngày thi đấu và các slot ca chơi trên Timeline Grid. Hệ thống kiểm tra tức thì trạng thái khả dụng của sân để tránh xung đột lịch. Sau khi xác nhận, người dùng được chuyển đến màn hình thanh toán. Controller tự động sinh chuỗi mã VietQR chuẩn Napas247 nhúng sẵn số tài khoản thụ hưởng, số tiền chính xác và mã đơn hàng (<code>ALOBOSPORT_ID</code>). Khách hàng thực hiện quét mã trên ứng dụng ngân hàng. Sau khi tiếp nhận thông báo nộp tiền thành công, trạng thái đơn đặt được cập nhật thành <code>confirmed</code>, sân thi đấu chuyển sang trạng thái <code>in_use</code> và hệ thống cấp vé điện tử (E-Ticket) với mã QR check-in tại quầy.</p>

<div class="figure-box">
  <img src="__LUONG_DATSAN__" alt="Sơ đồ luồng Đặt sân & Thanh toán">
  <div class="figure-caption">Hình 5: Sơ đồ luồng (Flowchart) chức năng Đặt sân & Thanh toán trực tuyến</div>
</div>

<div class="figure-box">
  <img src="__SEQ_DATSAN__" alt="Sơ đồ tuần tự Đặt sân & Thanh toán">
  <div class="figure-caption">Hình 6: Sơ đồ tuần tự (Sequence Diagram) chức năng Đặt sân & Thanh toán VietQR Người dùng</div>
</div>"""

pattern_213 = r"<h3>2\.1\.3\. Sơ đồ tuần tự chức năng Tự chọn 1:.*?</h3>.*?<div class=\"figure-caption\">Hình 3: Sơ đồ tuần tự chức năng Đặt sân.*?</div>\s*</div>"
tpl = re.sub(pattern_213, sec_213, tpl, flags=re.DOTALL)

# Update figure captions for remaining figures
tpl = tpl.replace("Hình 4: Sơ đồ tuần tự chức năng Quản lý & Cập nhật trạng thái đơn đặt sân Chủ sân", "Hình 7: Sơ đồ tuần tự (Sequence Diagram) chức năng Quản lý & Cập nhật trạng thái đơn đặt sân Chủ sân")
tpl = tpl.replace("Hình 5: Sơ đồ mạng PERT học thuật", "Hình 8: Sơ đồ mạng PERT học thuật")
tpl = tpl.replace("Hình 6: Phác thảo Wireframe sơ bộ Bảng điều khiển", "Hình 9: Phác thảo Wireframe sơ bộ Bảng điều khiển")
tpl = tpl.replace("Hình 7: Kết quả thực hiện thực tế Giao diện Bản đồ", "Hình 10: Kết quả thực hiện thực tế Giao diện Bản đồ")
tpl = tpl.replace("Hình 8: Phác thảo Wireframe sơ bộ giao diện Đăng ký", "Hình 11: Phác thảo Wireframe sơ bộ giao diện Đăng ký")
tpl = tpl.replace("Hình 9: Kết quả thực hiện thực tế giao diện Đăng ký", "Hình 12: Kết quả thực hiện thực tế giao diện Đăng ký")
tpl = tpl.replace("Hình 10: Phác thảo Wireframe sơ bộ giao diện Đăng nhập", "Hình 13: Phác thảo Wireframe sơ bộ giao diện Đăng nhập")
tpl = tpl.replace("Hình 11: Kết quả thực hiện thực tế giao diện Đăng nhập", "Hình 14: Kết quả thực hiện thực tế giao diện Đăng nhập")
tpl = tpl.replace("Hình 12: Phác thảo Wireframe sơ bộ giao diện Đặt sân", "Hình 15: Phác thảo Wireframe sơ bộ giao diện Đặt sân")
tpl = tpl.replace("Hình 13: Kết quả thực hiện thực tế giao diện Chọn sân", "Hình 16: Kết quả thực hiện thực tế giao diện Chọn sân")
tpl = tpl.replace("Hình 14: Kết quả thực hiện thực tế giao diện Xác nhận", "Hình 17: Kết quả thực hiện thực tế giao diện Xác nhận")
tpl = tpl.replace("Hình 15: Phác thảo Wireframe sơ bộ giao diện Quản lý", "Hình 18: Phác thảo Wireframe sơ bộ giao diện Quản lý")
tpl = tpl.replace("Hình 16: Kết quả thực hiện thực tế giao diện Quản lý", "Hình 19: Kết quả thực hiện thực tế giao diện Quản lý")
tpl = tpl.replace("Hình 17: Sơ đồ cấu trúc Cơ sở dữ liệu", "Hình 20: Sơ đồ cấu trúc Cơ sở dữ liệu")

with open("report_template.html", "w", encoding="utf-8") as f:
    f.write(tpl)
print("Updated report_template.html successfully!")

# 2. Update build_full_report.py to include new flowchart images
with open("build_full_report.py", "r", encoding="utf-8") as f:
    code = f.read()

new_mappings = '''    "__LUONG_DANGKY__": img_to_b64("template-do-an-ttnt/figs/luong_dangky.png"),
    "__LUONG_DANGNHAP__": img_to_b64("template-do-an-ttnt/figs/luong_dangnhap.png"),
    "__LUONG_DATSAN__": img_to_b64("template-do-an-ttnt/figs/luong_datsan.png"),'''

if "__LUONG_DANGKY__" not in code:
    code = code.replace('"__SEQ_DANGKY__": img_to_b64("template-do-an-ttnt/figs/seq_dangky.png"),', new_mappings + '\n    "__SEQ_DANGKY__": img_to_b64("template-do-an-ttnt/figs/seq_dangky.png"),')

with open("build_full_report.py", "w", encoding="utf-8") as f:
    f.write(code)
with open("build_pdf.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated build_full_report.py and build_pdf.py.")

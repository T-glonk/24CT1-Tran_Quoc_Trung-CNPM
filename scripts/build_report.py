# -*- coding: utf-8 -*-
import os, sys, base64, subprocess, shutil, io
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

# Xác định đường dẫn thư mục gốc dự án
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_path(rel_path):
    return os.path.join(BASE_DIR, rel_path)

def img_to_b64(rel_path):
    full_path = get_path(rel_path)
    if not os.path.exists(full_path):
        print(f"Warning: file {full_path} not found!")
        return ""
    ext = os.path.splitext(full_path)[1].lower()
    mime = "image/png" if ext == ".png" else "image/jpeg"
    with open(full_path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{data}"

template_path = get_path("report_template.html")
print(f"Reading template from {template_path}...")
with open(template_path, "r", encoding="utf-8") as f:
    template = f.read()

print("Encoding images...")
replacements = {
    "__LOGO__": img_to_b64("template-do-an-ttnt/assets/dau-logo.png"),
    "__LUONG_DANGKY__": img_to_b64("template-do-an-ttnt/figs/luong_dangky.png"),
    "__LUONG_DANGNHAP__": img_to_b64("template-do-an-ttnt/figs/luong_dangnhap.png"),
    "__LUONG_DATSAN__": img_to_b64("template-do-an-ttnt/figs/luong_datsan.png"),
    "__SEQ_DANGKY__": img_to_b64("template-do-an-ttnt/figs/seq_dangky.png"),
    "__SEQ_DANGNHAP__": img_to_b64("template-do-an-ttnt/figs/seq_dangnhap.png"),
    "__SEQ_DATSAN__": img_to_b64("template-do-an-ttnt/figs/seq_datsan.png"),
    "__SEQ_CHUSAN__": img_to_b64("template-do-an-ttnt/figs/seq_chusan.png"),
    "__PERT_CHART__": img_to_b64("HINH ANH/SƠ ĐỒ PERT/SO DO PERT.drawio.png"),
    "__WF_HOME__": img_to_b64("template-do-an-ttnt/figs/wireframe_home.jpg"),
    "__DEMO_MAP__": img_to_b64("template-do-an-ttnt/figs/demo_map_opt.jpg"),
    "__WF_DANGKY__": img_to_b64("template-do-an-ttnt/figs/wireframe_dangky.jpg"),
    "__DEMO_DANGKY__": img_to_b64("template-do-an-ttnt/figs/demo_dangky.png"),
    "__WF_DANGNHAP__": img_to_b64("template-do-an-ttnt/figs/wireframe_dangnhap.jpg"),
    "__DEMO_DANGNHAP__": img_to_b64("template-do-an-ttnt/figs/demo_dangnhap.png"),
    "__WF_DATSAN__": img_to_b64("template-do-an-ttnt/figs/wireframe_datsan.jpg"),
    "__WF_THANHTOAN__": img_to_b64("template-do-an-ttnt/figs/wireframe_thanhtoan.jpg"),
    "__DEMO_DATSAN__": img_to_b64("template-do-an-ttnt/figs/demo_datsan.png"),
    "__DEMO_THANHTOAN__": img_to_b64("template-do-an-ttnt/figs/demo_thanhtoan.png"),
    "__WF_QUANLY__": img_to_b64("template-do-an-ttnt/figs/wireframe_quanly.jpg"),
    "__DEMO_SANDADAT__": img_to_b64("template-do-an-ttnt/figs/demo_sandadat.png"),
    "__QUERY_ROLE__": img_to_b64("template-do-an-ttnt/figs/query_role.jpg"),
    "__QUERY_REVENUE__": img_to_b64("template-do-an-ttnt/figs/query_revenue.jpg"),
    "__ERD__": img_to_b64("template-do-an-ttnt/figs/erd.png"),
}

for tag, b64 in replacements.items():
    if not b64:
        print(f"Warning: No data for tag {tag}")
    template = template.replace(tag, b64)

# Write rendered HTML
html_path = get_path("report_render_full.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(template)
print(f"Generated complete HTML report at: {html_path}")

raw_pdf_path = get_path("report_raw_temp.pdf")
args = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={raw_pdf_path}",
    html_path
]

print("Compiling raw PDF with Edge Headless...")
subprocess.run(args, check=True)
print(f"Created raw PDF at: {raw_pdf_path}")

# Stamping page numbers: Bắt đầu từ trang LỜI MỞ ĐẦU (trang index 5, tức trang 6 của PDF)
print("Stamping page numbers starting from LỜI MỞ ĐẦU...")
writer = PdfWriter(clone_from=raw_pdf_path)

start_page_idx = -1
for idx, page in enumerate(writer.pages):
    text = page.extract_text() or ""
    if "Trong bối cảnh đô thị hóa" in text:
        start_page_idx = idx
        break

if start_page_idx == -1:
    start_page_idx = 5 # Mặc định trang 6 (index 5)
print(f"Detected 'LỜI MỞ ĐẦU' at PDF page index {start_page_idx} (Page {start_page_idx + 1}). This is numbered as Page 1.")

width, height = float(A4[0]), float(A4[1])

for idx in range(start_page_idx, len(writer.pages)):
    page_num = idx - start_page_idx + 1
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=A4)
    can.setFont("Times-Roman", 10)
    can.setFillColorRGB(0.1, 0.1, 0.1)
    can.drawCentredString(width / 2.0, 28.35, str(page_num)) # 10mm from bottom
    can.save()
    
    packet.seek(0)
    overlay_pdf = PdfReader(packet)
    writer.pages[idx].merge_page(overlay_pdf.pages[0])

# Output paths
out_pdfs = [
    get_path("BaoCao_CNPM_24CT1_TranQuocTrung.pdf"),
    get_path("BaoCao_DoAn_CNPM_24CT1_TranQuocTrung.pdf"),
    get_path("template-do-an-ttnt/do-an.pdf")
]

primary_out = out_pdfs[0]
with open(primary_out, "wb") as f:
    writer.write(f)
print(f"Created final PDF with custom page numbering: {primary_out} ({os.path.getsize(primary_out)} bytes)")

for p in out_pdfs[1:]:
    try:
        shutil.copy(primary_out, p)
        print(f"Copied to: {p}")
    except Exception as e:
        print(f"Notice: Could not copy to {p}: {e}")

# Cleanup raw temp PDF
if os.path.exists(raw_pdf_path):
    try:
        os.remove(raw_pdf_path)
    except:
        pass

print("Report generation finished successfully!")

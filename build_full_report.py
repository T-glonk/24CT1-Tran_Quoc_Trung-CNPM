# -*- coding: utf-8 -*-
import os, sys, base64, subprocess, shutil

def img_to_b64(path):
    if not os.path.exists(path):
        print(f"Warning: file {path} not found!")
        return ""
    ext = os.path.splitext(path)[1].lower()
    mime = "image/png" if ext == ".png" else "image/jpeg"
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:{mime};base64,{data}"

print("Reading report_template.html...")
with open("report_template.html", "r", encoding="utf-8") as f:
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
    "__PERT_CHART__": img_to_b64("template-do-an-ttnt/figs/pert_chart.png"),
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
    "__ERD__": img_to_b64("template-do-an-ttnt/figs/erd.png"),
}

for tag, b64 in replacements.items():
    if not b64:
        print(f"Warning: No data for tag {tag}")
    template = template.replace(tag, b64)

# Write rendered HTML
html_path = os.path.abspath("report_render_full.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(template)
print(f"Generated complete HTML report at: {html_path}")

out_pdf_root = os.path.abspath("BaoCao_DoAn_CNPM_24CT1_TranQuocTrung.pdf")
out_pdf_template = os.path.abspath("template-do-an-ttnt/do-an.pdf")

args = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={out_pdf_root}",
    html_path
]

print("Compiling PDF with Edge Headless...")
subprocess.run(args, check=True)
print(f"Created: {out_pdf_root} (size: {os.path.getsize(out_pdf_root)} bytes)")

try:
    shutil.copy(out_pdf_root, out_pdf_template)
    print(f"Copied to: {out_pdf_template}")
except Exception as e:
    print(f"Notice: Could not copy to {out_pdf_template}: {e}")

print("Report generation finished successfully!")

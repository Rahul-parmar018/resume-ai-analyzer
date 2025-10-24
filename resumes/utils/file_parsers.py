import pdfplumber
from docx import Document

def read_pdf(file_obj):
    text = []
    with pdfplumber.open(file_obj) as pdf:
        for page in pdf.pages:
            text.append(page.extract_text() or "")
    return "\n".join(text)

def read_docx(file_obj):
    doc = Document(file_obj)
    return "\n".join([p.text for p in doc.paragraphs])

SUPPORTED = {".pdf": read_pdf, ".docx": read_docx}

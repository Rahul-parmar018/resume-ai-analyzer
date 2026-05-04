import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from resumes.views import _extract_text
from resumes.utils.gap_analysis import analyze_resume_text, ROLES
from django.core.files.uploadedfile import SimpleUploadedFile

def test_logic():
    print("Testing extraction...")
    # Mock a PDF file
    content = b"%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"
    f = SimpleUploadedFile("test.pdf", content, content_type="application/pdf")
    
    try:
        text, _ = _extract_text(f)
        print(f"Extracted text: {text[:50]}...")
        
        role_key = "AI/ML Engineer"
        role_template = ROLES.get(role_key, {})
        print(f"Analyzing for role: {role_key}")
        
        analysis = analyze_resume_text(text, role_template)
        print(f"Analysis score: {analysis['score']}")
        print("Success!")
    except Exception as e:
        import traceback
        print(f"FAILED: {e}")
        print(traceback.format_exc())

if __name__ == "__main__":
    test_logic()

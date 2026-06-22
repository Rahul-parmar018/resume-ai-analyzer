from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from app.services.text_extractor import extract_text
from app.services.extractor import extract_all, extract_summary

router = APIRouter()


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: Optional[str] = Form(None)
):
    """
    Analyze a resume

    - Accepts PDF or DOCX file
    - Optional job_description for matching
    - Returns extracted text and basic metrics
    """
    # Validate file type
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

    if resume.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {resume.content_type}. Only PDF and DOCX are allowed."
        )

    try:
        # Read file bytes
        file_bytes = await resume.read()

        # Extract text
        extraction_result = extract_text(file_bytes, resume.filename)

        # Basic analysis (we'll expand this later)
        result = {
            "extracted_text": extraction_result["text"],
            "filename": extraction_result["filename"],
            "file_type": extraction_result["file_type"],
            "char_count": extraction_result["char_count"],
            "word_count": len(extraction_result["text"].split()),
            "line_count": len(extraction_result["text"].split('\n')),
            "job_description_provided": bool(job_description)
        }

        # If job description provided, do basic matching
        if job_description:
            result["match_analysis"] = analyze_match(
                extraction_result["text"],
                job_description
            )

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/extract")
async def extract_resume(
    resume: UploadFile = File(...),
):
    """
    Extract structured information from resume

    - Accepts PDF or DOCX file
    - Returns skills, education, experience, projects
    """
    # Validate file type
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

    if resume.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {resume.content_type}. Only PDF and DOCX are allowed."
        )

    try:
        # Read file bytes
        file_bytes = await resume.read()

        # Extract text
        extraction_result = extract_text(file_bytes, resume.filename)
        text = extraction_result["text"]

        # Extract structured information
        extracted = extract_all(text)
        summary = extract_summary(text)

        return {
            "filename": extraction_result["filename"],
            "extracted": extracted,
            "summary": summary,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


def analyze_match(resume_text: str, job_description: str) -> dict:
    """
    Basic keyword matching between resume and job description
    """
    # Convert to lowercase for comparison
    resume_lower = resume_text.lower()
    job_lower = job_description.lower()

    # Extract words (simple tokenization)
    job_words = set(job_lower.split())

    # Find common words (excluding common stopwords)
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
    job_keywords = job_words - stopwords

    # Find matches
    resume_words = set(resume_lower.split())
    matched_keywords = job_keywords & resume_words

    # Calculate match percentage
    match_percentage = (len(matched_keywords) / len(job_keywords) * 100) if job_keywords else 0

    return {
        "matched_keywords": list(matched_keywords),
        "missing_keywords": list(job_keywords - matched_keywords),
        "match_percentage": round(match_percentage, 1)
    }
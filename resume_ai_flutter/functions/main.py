from firebase_functions import firestore_fn, options
from firebase_admin import initialize_app, firestore, storage
import pypdf
import io
import json
import os

initialize_app()

@firestore_fn.on_document_created(
    document="resumes/{resumeId}",
    memory=options.MemoryOption.MB_512,
    timeout_sec=60,
    region="us-central1", # Default, change if needed
)
def process_resume(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    """
    Triggers when a new resume document is created.
    Downloads the file, extracts text, and performs AI analysis.
    """
    doc_snapshot = event.data
    if not doc_snapshot:
        print("No data associated with the event")
        return

    doc_data = doc_snapshot.to_dict()
    resume_id = event.params["resumeId"]
    
    # Idempotency / Validation
    status = doc_data.get("status")
    if status == "analyzed" or status == "error":
        print(f"Resume {resume_id} already processed. Skipping.")
        return

    storage_path = doc_data.get("storagePath")
    if not storage_path:
        print(f"No storagePath found for resume {resume_id}. Marking as error.")
        _mark_error(doc_snapshot.reference, "Missing storage path")
        return

    try:
        print(f"Processing resume {resume_id} from {storage_path}...")
        
        # 1. Download file
        bucket = storage.bucket()
        blob = bucket.blob(storage_path)
        file_bytes = blob.download_as_bytes()
        
        # 2. Extract Text (PDF only for now)
        # TODO: Add logic for DOCX if needed
        text = ""
        with io.BytesIO(file_bytes) as f:
            pdf_reader = pypdf.PdfReader(f)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        
        clean_text = text.strip()
        if not clean_text:
            raise ValueError("Could not extract any text from the PDF.")

        print(f"Extracted {len(clean_text)} characters.")

        # 3. Call AI Service (MOCKED FOR NOW - User needs to add API Key)
        # In production: 
        #   api_key = os.environ.get("OPENAI_API_KEY")
        #   client = OpenAI(api_key=api_key)
        #   response = client.chat.completions.create(...)
        
        # Mock Analysis Result
        analysis_result = {
            "score": 85,
            "summary": "This is a placeholder summary. AI integration pending API Key.",
            "skills": ["Python", "Flutter", "Firebase", "System Design"],
            "improvements": ["Add more metrics", "Check spelling"],
            "atsCompatibility": "High"
        }

        # 4. Update Firestore
        doc_snapshot.reference.update({
            "status": "analyzed",
            "analysis": analysis_result,
            "extractedText": clean_text[:5000], # Store first 5k chars for reference
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        print(f"Successfully analyzed resume {resume_id}.")

    except Exception as e:
        print(f"Error processing resume {resume_id}: {e}")
        _mark_error(doc_snapshot.reference, str(e))

def _mark_error(doc_ref, reason: str):
    doc_ref.update({
        "status": "error",
        "metadata.errorReason": reason,
        "updatedAt": firestore.SERVER_TIMESTAMP
    })

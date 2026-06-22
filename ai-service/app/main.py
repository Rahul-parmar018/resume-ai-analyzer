import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.resume import router as resume_router

load_dotenv()

app = FastAPI(
    title="Resume AI Service",
    description="ATS Resume Scanner - Text Extraction & Analysis",
    version="1.0.0"
)

# CORS - allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume_router, prefix="/api")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-service"}

@app.get("/")
async def root():
    return {"message": "Resume AI Service is running"}
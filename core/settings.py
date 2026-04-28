from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-dev-key")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ALLOWED_HOSTS = ["*"]  # Allow all hosts for production/deployment
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "resumes",
    "rest_framework",
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

# CORS Hardening for Production & Cross-Origin Auth
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://resume-ai-analyzer.vercel.app",
    "https://candidex-ai-analyzer.vercel.app",
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://localhost:5173$",
    r"^http://127.0.0.1:5173$",
    r"https://.*\.onrender\.com$",
    r"https://.*\.vercel\.app$",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Rate limiting settings
RATE_LIMIT_ENABLED = True
RATE_LIMIT_REQUESTS_PER_MINUTE = 60
RATE_LIMIT_STORAGE = 'django.core.cache.backends.locmem.LocMemCache'

ROOT_URLCONF = "core.urls"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

WSGI_APPLICATION = "core.wsgi.application"

import dj_database_url

DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
_frontend_dist = BASE_DIR / "frontend" / "dist"
STATICFILES_DIRS = [_frontend_dist] if _frontend_dist.exists() else []
STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Firebase Admin SDK Initialization
import os
import json
import base64
import firebase_admin
from firebase_admin import credentials

firebase_cred_path = BASE_DIR / "firebase-adminsdk.json"
if not firebase_admin._apps:
    cred_json = None

    # Priority 1: Local JSON file (dev environment)
    if os.path.exists(firebase_cred_path):
        cred = credentials.Certificate(str(firebase_cred_path))
        firebase_admin.initialize_app(cred)
        print("Firebase initialized from local file.")

    # Priority 2: Base64-encoded JSON env var (safest for production)
    elif os.getenv("FIREBASE_ADMIN_SDK_BASE64"):
        try:
            decoded = base64.b64decode(os.getenv("FIREBASE_ADMIN_SDK_BASE64")).decode("utf-8")
            cred_json = json.loads(decoded)
        except Exception as e:
            print(f"ERROR parsing FIREBASE_ADMIN_SDK_BASE64: {e}")

    # Priority 3: Raw JSON env var (fallback)
    elif os.getenv("FIREBASE_ADMIN_SDK_JSON"):
        raw = os.getenv("FIREBASE_ADMIN_SDK_JSON")
        try:
            cred_json = json.loads(raw)
        except json.JSONDecodeError:
            try:
                # Handle env vars where \n became real newlines
                cleaned = raw.replace("\n", "\\n").replace("\r", "")
                cred_json = json.loads(cleaned)
            except Exception as e:
                print(f"ERROR parsing FIREBASE_ADMIN_SDK_JSON: {e}")

    if cred_json and not firebase_admin._apps:
        cred = credentials.Certificate(cred_json)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized from env var.")

    if not firebase_admin._apps:
        print("WARNING: Firebase Admin SDK not initialized. No credentials found.")

# ---------- Add your OpenAI key ----------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Django Rest Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'resumes.auth_backend.FirebaseAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
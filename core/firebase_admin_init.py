import firebase_admin
from firebase_admin import credentials
import os
from django.conf import settings

# Determine the absolute path to the json keys that we saved previously
key_path = os.path.join(settings.BASE_DIR, "firebase-adminsdk.json")

def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)

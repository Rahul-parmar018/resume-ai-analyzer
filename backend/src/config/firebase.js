import admin from 'firebase-admin';

// Initialize Firebase Admin
// In production, use FIREBASE_SERVICE_ACCOUNT from env
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT || '{}';

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (e) {
  serviceAccount = {};
}

// Only initialize if we have valid credentials
if (serviceAccount.project_id) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} else {
  console.warn('⚠️  Firebase credentials not configured. Auth will be disabled.');
}

export default admin;
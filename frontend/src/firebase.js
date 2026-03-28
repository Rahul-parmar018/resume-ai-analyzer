import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC_xnK91LxqVRfrA4Q98bMmoc-8BOdeA6U",
  authDomain: "resume-ai-analyzer-df8fc.firebaseapp.com",
  projectId: "resume-ai-analyzer-df8fc",
  storageBucket: "resume-ai-analyzer-df8fc.firebasestorage.app",
  messagingSenderId: "699854133780",
  appId: "1:699854133780:web:4466826ebdd36c67e0a501",
  measurementId: "G-WYXN7ZS5D9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

import { db } from "./firebase";
import { doc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

/**
 * Creates a user profile in Firestore after successful Auth registration.
 * @param {Object} user - The Firebase User object.
 */
export const createUserProfile = async (user) => {
  if (!user) return;
  
  const userRef = doc(db, "Users", user.uid);
  await setDoc(userRef, {
    email: user.email,
    created_at: new Date(),
  });
};

/**
 * Saves a parsed resume document to the "Resumes" collection.
 * @param {Object} data - Resume data (user_id, resume_text, file_url).
 */
export const saveResume = async (data) => {
  await addDoc(collection(db, "Resumes"), {
    ...data,
    uploaded_at: new Date(),
  });
};

/**
 * Saves a resume analysis result to the "Analysis" collection.
 * @param {Object} data - Analysis data (user_id, resume_id, score, feedback, ai_response).
 */
export const saveAnalysis = async (data) => {
  const docRef = await addDoc(collection(db, "Analysis"), {
    ...data,
    created_at: new Date(),
  });
  return docRef.id;
};

/**
 * Retrieves the analysis history for a specific user.
 * @param {string} userId - The Firebase UID.
 */
export const getAnalysisHistory = async (userId) => {
  if (!userId) return [];
  const q = query(collection(db, "Analysis"), where("user_id", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.created_at ? data.created_at.toDate().toLocaleDateString() : "Just now"
    };
  });
};

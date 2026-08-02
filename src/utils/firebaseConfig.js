import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const getConfigValue = (val, fallback) => {
  if (!val || val === 'undefined' || val === 'null' || val.trim() === '') return fallback;
  return val;
};

const firebaseConfig = {
  apiKey: getConfigValue(import.meta.env.VITE_FIREBASE_API_KEY, "AIzaSyD2w4PNyAbuZXrRNwgbtk6wug4d9xP7j68"),
  authDomain: getConfigValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "moslih84-consultant.firebaseapp.com"),
  projectId: getConfigValue(import.meta.env.VITE_FIREBASE_PROJECT_ID, "moslih84-consultant"),
  storageBucket: getConfigValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "moslih84-consultant.firebasestorage.app"),
  messagingSenderId: getConfigValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "448828971297"),
  appId: getConfigValue(import.meta.env.VITE_FIREBASE_APP_ID, "1:448828971297:web:8399fe25728050e2420660")
};

let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { app, auth, db, storage };
export const ADMIN_WHITELIST = ['moslihayoub@gmail.com'];

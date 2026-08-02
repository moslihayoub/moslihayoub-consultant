import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyD2w4PNyAbuZXrRNwgbtk6wug4d9xP7j68",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "moslih84-consultant.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "moslih84-consultant",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "moslih84-consultant.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "448828971297",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:448828971297:web:8399fe25728050e2420660"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cleanLeads = async () => {
  const querySnapshot = await getDocs(collection(db, "leads"));
  let count = 0;
  for (const document of querySnapshot.docs) {
    const data = document.data();
    if (['amine', 'Bssila', 'ayman', 'aziz'].includes(data.name)) {
      await deleteDoc(doc(db, "leads", document.id));
      count++;
    }
  }
  console.log(`Deleted ${count} duplicate/fake leads.`);
};

cleanLeads();

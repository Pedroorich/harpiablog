import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// The project ID provided by the user
const projectId = '659666582406';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "INSERT_API_KEY_HERE",
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:659666582406:web:YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

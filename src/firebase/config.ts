import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1TH8TasDZx5e8P-0YvfCZnof9z3I0_7I",
  authDomain: "zavulon-bef21.firebaseapp.com",
  projectId: "zavulon-bef21",
  storageBucket: "zavulon-bef21.firebasestorage.app",
  messagingSenderId: "448549978006",
  appId: "1:448549978006:web:7024ceb4d01f086326a7b7",
  measurementId: "G-YF15WC5YYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

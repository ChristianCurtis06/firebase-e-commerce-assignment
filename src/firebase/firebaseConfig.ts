import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "e-commerce-assignment-9c693.firebaseapp.com",
  projectId: "e-commerce-assignment-9c693",
  storageBucket: "e-commerce-assignment-9c693.firebasestorage.app",
  messagingSenderId: "250588956187",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };

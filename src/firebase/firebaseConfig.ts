import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFShrGo9rZTuITuO-d-FnRfL4PvKmcfBE",
  authDomain: "e-commerce-assignment-9c693.firebaseapp.com",
  projectId: "e-commerce-assignment-9c693",
  storageBucket: "e-commerce-assignment-9c693.firebasestorage.app",
  messagingSenderId: "250588956187",
  appId: "1:250588956187:web:487fcfc36b61e3907f9abe"
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
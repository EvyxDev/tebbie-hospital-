//firebase/config.js
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyANpB3y5Oj7zHMfzQvMPtIH5JCsOp7eH64",
  authDomain: "tabi-4ebab.firebaseapp.com",
  databaseURL: "https://tebbi-1fda2-default-rtdb.firebaseio.com",
  projectId: "tabi-4ebab",
  storageBucket: "tabi-4ebab.firebasestorage.app",
  messagingSenderId: "15841420156",
  appId: "1:15841420156:web:15322e26632bbf5b993af9",
  measurementId: "G-39N8YZZRNX",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const Auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const rtdb = getDatabase(app);

export { getToken };

export default app;

//firebase/config.js
import { getAuth } from "firebase/auth";
import { initializeApp   } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCsDflLnpLi_KEWs9zfVSugG9ehdPTy-Y4",
  authDomain: "tebbi-1fda2.firebaseapp.com",
  databaseURL: "https://tebbi-1fda2-default-rtdb.firebaseio.com",
  projectId: "tebbi-1fda2",
  storageBucket: "tebbi-1fda2.firebasestorage.app",
  messagingSenderId: "922205311973",
  appId: "1:922205311973:web:586443ca008a4c579a950c",
  measurementId: "G-BVPP75RRCK"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const Auth =getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const rtdb = getDatabase(app);

export { getToken };

export default app;
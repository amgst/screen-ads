import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHYhk40GDa15eodz7Tah4_1mx49hExJyg",
  authDomain: "digital-ads-a1103.firebaseapp.com",
  projectId: "digital-ads-a1103",
  storageBucket: "digital-ads-a1103.firebasestorage.app",
  messagingSenderId: "1045645764119",
  appId: "1:1045645764119:web:cea728a8974a5b530c5e52"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

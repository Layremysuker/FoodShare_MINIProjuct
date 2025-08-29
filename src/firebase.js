// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ เพิ่มตรงนี้

const firebaseConfig = {
  apiKey: "AIzaSyD_b9wrt2arX4Kn4lVpamW4CCvjRzh4HfQ",
  authDomain: "foodshare-6b9cd.firebaseapp.com",
  projectId: "foodshare-6b9cd",
  storageBucket: "foodshare-6b9cd.firebasestorage.app",
  messagingSenderId: "915356278039",
  appId: "1:915356278039:web:0bf110f0398bcc34bf2b52",
  databaseURL: "https://foodshare-6b9cd-default-rtdb.asia-southeast1.firebasedatabase.app",
  measurementId: "G-V2DB7H8229"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Export services
export const auth = getAuth(app);
export const database = getDatabase(app); // ✅ ใช้งาน Realtime Database

export default app;
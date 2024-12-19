// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrkBMw0esvepcnLG73s_zeE4oOSyDgwik",
  authDomain: "edunity-edutechweb.firebaseapp.com",
  databaseURL: "https://edunity-edutechweb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "edunity-edutechweb",
  storageBucket: "edunity-edutechweb.appspot.com",
  messagingSenderId: "844615279486",
  appId: "1:844615279486:web:a0465a91dcde250027092f",
  measurementId: "G-PJ7S0WB12H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database instance
export const database = getDatabase(app);

// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "domore-60c71.firebaseapp.com",
  projectId: "domore-60c71",
  storageBucket: "domore-60c71.firebasestorage.app",
  messagingSenderId: "290983853023",
  appId: "1:290983853023:web:bd64391d51ba8cfa0b226a"
};

// Initialize Firebase
const app = getApps.length == 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app)
const auth = getAuth(app);

export { db,auth }
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "domore-60c71.firebaseapp.com",
  projectId: "domore-60c71",
  storageBucket: "domore-60c71.firebasestorage.app",
  messagingSenderId: "290983853023",
  appId: "1:290983853023:web:bd64391d51ba8cfa0b226a"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore
export const db = getFirestore(app);

// Auth with persistence (only export this!)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),})









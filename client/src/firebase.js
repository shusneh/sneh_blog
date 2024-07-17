// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogapp-125af.firebaseapp.com",
  projectId: "blogapp-125af",
  storageBucket: "blogapp-125af.appspot.com",
  messagingSenderId: "952070088064",
  appId: "1:952070088064:web:c22f128b851a76aeaf4d65"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
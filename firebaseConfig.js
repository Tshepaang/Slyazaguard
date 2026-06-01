// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHQrEqWNzrRK2L5KRRmG_u9hRhd_stIjU",
  authDomain: "slyza-guard.firebaseapp.com",
  projectId: "slyza-guard",
  storageBucket: "slyza-guard.firebasestorage.app",
  messagingSenderId: "300421752932",
  appId: "1:300421752932:web:ddc2d94d787f9c06c8d771",
  measurementId: "G-ZLZW31EL95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
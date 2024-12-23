// firebase.js

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "microventures-69a96.firebaseapp.com",
  projectId: "microventures-69a96",
  storageBucket: "microventures-69a96.appspot.com",
  messagingSenderId: "1071242829137",
  appId: "1:1071242829137:web:e8f751d16337fa97ed0770",
  measurementId: "G-9Y99QJ1YQ5"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// firebase.js

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9kXi41imYgtoK2-tMCbGHx7CPUY9Hj1E",
  authDomain: "microventures-69a96.firebaseapp.com",
  projectId: "microventures-69a96",
  storageBucket: "microventures-69a96.appspot.com",
  messagingSenderId: "1071242829137",
  appId: "1:1071242829137:web:e8f751d16337fa97ed0770",
  measurementId: "G-9Y99QJ1YQ5"
};
// const admin = require('firebase-admin');
// admin.initializeApp();

// async function setAdmin(email) {
//   const user = await admin.auth().getUserByEmail(email);
//   await admin.auth().setCustomUserClaims(user.uid, { admin: true });
//   console.log(`Admin privileges granted to ${email}`);
// }

// setAdmin('gokulsenthil0906@gmail.com');
// // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

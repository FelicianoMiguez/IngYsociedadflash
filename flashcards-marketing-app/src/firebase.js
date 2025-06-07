// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA48y06MrNMooOIMBlF1cWcd5wdCo4Zgs",
  authDomain: "ing-y-sociedad-86520.firebaseapp.com",
  projectId: "ing-y-sociedad-86520",
  storageBucket: "ing-y-sociedad-86520.appspot.com",
  messagingSenderId: "259873351483",
  appId: "1:259873351483:web:3d72ad945072ebed38791e",
  measurementId: "G-ZBDMZT2B60"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_Zac0dyo05GPzid1jUu5jQrn0dGiGREQ",
  authDomain: "roboweb-technologies.firebaseapp.com",
  projectId: "roboweb-technologies",
  storageBucket: "roboweb-technologies.firebasestorage.app",
  messagingSenderId: "645143645827",
  appId: "1:645143645827:web:f9a0250ba5249e22fe95b6",
  measurementId: "G-CMZFMF4WZ7",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
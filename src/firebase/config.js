// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsLGG6Vh0uQnzBYx76OnhTWMibjteb09k",
  authDomain: "biblioteca-1acc2.firebaseapp.com",
  projectId: "biblioteca-1acc2",
  storageBucket: "biblioteca-1acc2.firebasestorage.app",
  messagingSenderId: "311784827508",
  appId: "1:311784827508:web:bb7d4e05ae2fb84a03bf21",
  measurementId: "G-WF3MV0MZZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
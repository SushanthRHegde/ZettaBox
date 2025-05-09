
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVZp8XFw-C0wfgdKz-F6WRM-O-5g9bJV4",
  authDomain: "zettabox.firebaseapp.com",
  projectId: "zettabox",
  storageBucket: "zettabox.firebasestorage.app",
  messagingSenderId: "847574710044",
  appId: "1:847574710044:web:a9d1046e0395e468aaecd9",
  measurementId: "G-9ZYCMLZR93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  googleProvider,
  signInWithPopup,
  updateProfile
};

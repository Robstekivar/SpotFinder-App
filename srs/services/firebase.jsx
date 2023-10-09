// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbizlNoZqfqchJoxZYNTrGoCGVbadu55k",
    authDomain: "map-project-b729e.firebaseapp.com",
    projectId: "map-project-b729e",
    storageBucket: "map-project-b729e.appspot.com",
    messagingSenderId: "1051168470914",
    appId: "1:1051168470914:web:142084b11e46226b72419b"
  };

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
const reference =ref

export {auth, db, collection, addDoc, getDocs, database, storage, reference, getDownloadURL};
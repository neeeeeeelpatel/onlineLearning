import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // Paste your config here
    apiKey: "AIzaSyAjmQfICIM7sQDAHO8Zsqd34q8NsfxXvVg",
    authDomain: "onlinelearning-c296b.firebaseapp.com",
    databaseURL: "https://onlinelearning-c296b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "onlinelearning-c296b",
    storageBucket: "onlinelearning-c296b.firebasestorage.app",
    messagingSenderId: "118886823134",
    appId: "1:118886823134:web:760d579a967e82f9bdfe4f",
    measurementId: "G-DS3PHXSD2X" 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

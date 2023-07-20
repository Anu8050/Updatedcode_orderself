import { initializeApp } from "firebase/app";
import { getFirestore, FieldValue, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional  

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID

    // apiKey: "AIzaSyCkp0kAhmawcp9G90PP7D-M67Kj3HJzuwg",
    // authDomain: "orderselfdb.firebaseapp.com",
    // projectId: "orderselfdb",
    // storageBucket: "orderselfdb.appspot.com",
    // messagingSenderId: "587486512635",
    // appId: "1:587486512635:web:7d455844fc03712a76f75e",
    // measurementId: "G-4PPYBK2DCV"


    // apiKey: "AIzaSyCAKN84jxatCaASfzJnnrSJIbuJfrH-e3Q",
    // authDomain: "orderselfnewdb.firebaseapp.com",   
    // projectId: "orderselfnewdb",
    // storageBucket: "orderselfnewdb.appspot.com",
    // messagingSenderId: "989238603970",
    // appId: "1:989238603970:web:2eb2668dd2824321fc0b5b",
    // measurementId: "G-QKHT35BSXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
// console.log("Getting the db object")
const db = getFirestore();

const fsFieldValue = FieldValue;

// Firebase storage reference
const storage = getStorage(app);

const auth = getAuth(app);

var config = { db, storage, auth, fsFieldValue, doc };

export default config;

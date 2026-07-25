import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCj53KgeEPfa3q9u_zEKEYZPedK5TVNK0Q",
    authDomain: "peryadice.firebaseapp.com",
    projectId: "peryadice",
    storageBucket: "peryadice.firebasestorage.app",
    messagingSenderId: "871819732352",
    appId: "1:871819732352:web:d2c47bbb81839274ff8d65",
    measurementId: "G-KY07J1J3VL"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
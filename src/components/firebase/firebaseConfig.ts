import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApwX_E-43ZKjH8eWkVYUP2I57mUGAo0uY",
    authDomain: "pi5025.firebaseapp.com",
    projectId: "pi5025",
    storageBucket: "pi5025.firebasestorage.app",
    messagingSenderId: "379670513911",
    appId: "1:379670513911:web:7cac78fbbe649e81682bf2",
    measurementId: "G-PN0F2F51Y8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db};

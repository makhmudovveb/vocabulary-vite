// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAs79oNxuXSfcNTsd1I0IN-PH_0AtVgqQ",
  authDomain: "mki-vocabulary.firebaseapp.com",
  projectId: "mki-vocabulary",
  storageBucket: "mki-vocabulary.appspot.com",
  messagingSenderId: "173090621366",
  appId: "1:173090621366:web:ec6fee6875cb1467f5a317"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

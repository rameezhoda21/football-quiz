// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmGG_JH2oYjKlZ_XcmuVZgzyo4uO3G4KQ",
  authDomain: "footballquiz-a6755.firebaseapp.com",
  projectId: "footballquiz-a6755",
  storageBucket: "footballquiz-a6755.firebasestorage.app",
  messagingSenderId: "436787455144",
  appId: "1:436787455144:web:41a91fd6fbb0b350134e9d",
  measurementId: "G-T9ZE16R5D3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpT9tRlxJ6uQwk0MfIAW55pO9pj7sgo98",
  authDomain: "shareco-dcd6b.firebaseapp.com",
  projectId: "shareco-dcd6b",
  storageBucket: "shareco-dcd6b.appspot.com",
  messagingSenderId: "758118001413",
  appId: "1:758118001413:web:5649531e119013e58fa56c",
};

const app = initializeApp(firebaseConfig);
export const fireStoreDB = getFirestore();

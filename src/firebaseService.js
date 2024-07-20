// src/firebaseService.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDYiNKekAWAdrKjjNn40pedpTgBfZGcJ1E",
  authDomain: "e4e-assignment.firebaseapp.com",
  databaseURL: "https://e4e-assignment.firebaseio.com",
  projectId: "e4e-assignment",
  storageBucket: "e4e-assignment.appspot.com",
  messagingSenderId: "156297147823",
  appId: "1:156297147823:web:e1dc5820e7044b2c852b5a",
  measurementId: "G-Q9T3FWT0W9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const getPeople = async () => {
  const peopleRef = ref(db, "patients");
  const snapshot = await get(peopleRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

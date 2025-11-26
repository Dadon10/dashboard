import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app, auth, db, storage;

export const initFirebase = () => {
  if (app) return true; 
  try {
    const firebaseConfig = {
      apiKey: "AIzaSyAWywzGnsKCkfuabo7hCpzECkizVUlwFtc",
      authDomain: "garbagecollectionapp-e999e.firebaseapp.com",
      projectId: "garbagecollectionapp-e999e",
      storageBucket: "garbagecollectionapp-e999e.appspot.com",
      messagingSenderId: "34201078156",
      appId: "1:34201078156:web:befecd59c9c99f9357aea9",
      measurementId: "G-BSDLHWCKJX",
    };
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    return true;
  } catch (err) {
    console.error("Firebase initialization error:", err);
    return false;
  }
};

export { app, auth, db, storage };

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app, auth, db;

export const initFirebase = () => {
  const configStr = localStorage.getItem('firebaseConfig');
  if (!configStr) return false;

  try {
    const config = JSON.parse(configStr);
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    return true;
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return false;
  }
};

export { app, auth, db };

// lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    // ⬇️ Replace these lines with your raw, hard-coded values ⬇️
    apiKey: "AIzaSyCyCOIZFUa2Q6afRqJooJTso_cUfIeJ4Tc",
    authDomain: "uae-discount-hub.firebaseapp.com",
    projectId: "uae-discount-hub",
    storageBucket: "uae-discount-hub.firebasestorage.app",
    messagingSenderId: "920298316310",
    appId: "1:920298316310:web:ea2d2fbd7e2796a47e8b37"
    // ⬆️ Keep this as-is for now ⬆️
};
// Initialize Firebase (client-side)
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

// Initialize services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;

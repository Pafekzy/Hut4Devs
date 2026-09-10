import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';

// Fallback config from generated applet config or environment variables
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyBqwaA5P-vw_wz-5Cl_hsVv3BPj9r63ueo',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0067439388.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0067439388',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0067439388.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '220110410438',
  appId: env.VITE_FIREBASE_APP_ID || '1:220110410438:web:1fe62e16fc5109c6913dc7',
};

const databaseId =
  env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  'ai-studio-hut4devsstudio04-47c40103-27ae-40fc-92e9-f9602dc6f813';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firestore initialization with named database if present
let firestoreDb: Firestore;
try {
  firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
} catch (e) {
  console.warn('[Firebase] Initializing default Firestore database:', e);
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign in with Email & Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return result.user;
}

/**
 * Create user with Email & Password
 */
export async function signUpWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  return result.user;
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export {
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
};
export type { FirebaseUser };

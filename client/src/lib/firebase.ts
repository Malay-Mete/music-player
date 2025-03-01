import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "default",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Log initialization details for debugging
const currentDomain = window.location.hostname;
console.log("Current domain:", currentDomain);
console.log("Initializing Firebase with config:", {
  ...firebaseConfig,
  apiKey: "HIDDEN" // Don't log the API key
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // Call our backend to create/update user
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }),
      credentials: 'include'
    });
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    if (error.code === 'auth/unauthorized-domain') {
      const domain = window.location.hostname;
      throw new Error(
        `Please add "${domain}" to the authorized domains list in your Firebase Console:\n` +
        "1. Go to Firebase Console > Authentication > Settings\n" +
        "2. Under 'Authorized domains', click 'Add domain'\n" +
        `3. Add "${domain}"\n` +
        "4. Click 'Add'"
      );
    }
    throw error;
  }
};

export const signOut = () => auth.signOut();
// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: 'AIzaSyDlSvfwIixfjxjlMNIGe8thvVI6iia1kCU',
  authDomain: 'merge-mate-65624.firebaseapp.com',
  projectId: 'merge-mate-65624',
  storageBucket: 'merge-mate-65624.firebasestorage.app',
  messagingSenderId: '368246910040',
  appId: '1:368246910040:web:e78184b6e5bfa7878cae2d',
  measurementId: "G-8C46CQSFNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize authentication and GitHub provider
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider(); // Correct initialization

// Export the necessary objects
export { auth, githubProvider };

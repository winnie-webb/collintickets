// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9LHsYDmTuTtlRdk8C7w7yMmoCHSKioMc",
  authDomain: "ticketgen-506ee.firebaseapp.com",
  projectId: "ticketgen-506ee",
  storageBucket: "ticketgen-506ee.appspot.com",
  messagingSenderId: "3538329868",
  appId: "1:3538329868:web:a3d0d270903472f0d52929",
  measurementId: "G-X014XS6S58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

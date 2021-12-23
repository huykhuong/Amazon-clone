import firebase from "firebase/app";
import "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCvooqMyYQxlc07cTEgm_PEAzTPMWZ6_jg",
  authDomain: "clone-fdc4a.firebaseapp.com",
  projectId: "clone-fdc4a",
  storageBucket: "clone-fdc4a.appspot.com",
  messagingSenderId: "1091727807608",
  appId: "1:1091727807608:web:2ae7276900ac31b92a898d",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export default db;

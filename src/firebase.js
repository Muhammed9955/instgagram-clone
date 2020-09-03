import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDDVxRHazFBuT1MtlnrCvEPLJjG69EPzvw",
  authDomain: "instagram-clone-react-c964b.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-c964b.firebaseio.com",
  projectId: "instagram-clone-react-c964b",
  storageBucket: "instagram-clone-react-c964b.appspot.com",
  messagingSenderId: "270513397503",
  appId: "1:270513397503:web:843625b98fb8bbd35536ca",
  measurementId: "G-JFMZ9B332Y",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
// export default db;

import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBmQw-Xv_0g9xHqfYsg_zoaF7DNQ49PKPU",
    authDomain: "instagram-clone-react-8e2c2.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-8e2c2.firebaseio.com",
    projectId: "instagram-clone-react-8e2c2",
    storageBucket: "instagram-clone-react-8e2c2.appspot.com",
    messagingSenderId: "673371734993",
    appId: "1:673371734993:web:4a609316159398d73ad6f0",
    measurementId: "G-MM5X6WRCTG"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
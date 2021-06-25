import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCpXij3yCIga-GID7mcNj8BDoHeGqk2WmQ",
  authDomain: "letmeask-aa6fb.firebaseapp.com",
  projectId: "letmeask-aa6fb",
  storageBucket: "letmeask-aa6fb.appspot.com",
  messagingSenderId: "516748914241",
  appId: "1:516748914241:web:f5d30b363537beb05420c0",
  measurementId: "G-29DLPQ15KD"
};
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const database = firebase.database();
  export {firebase, auth, database}
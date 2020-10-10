import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAZqTo4lJIAox3IrEY5A_SJIdp_Lz94Y4Q",
    authDomain: "tutorscopesignup.firebaseapp.com",
    databaseURL: "https://tutorscopesignup.firebaseio.com",
    projectId: "tutorscopesignup",
    storageBucket: "tutorscopesignup.appspot.com",
    messagingSenderId: "723820485687",
    appId: "1:723820485687:web:c3eca741d5f642858233b2"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;
export const db = firebase.database();

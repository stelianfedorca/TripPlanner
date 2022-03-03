// Import the functions you need from the SDKs you need
import {initializeApp,getApps, getApp} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6DzHNcxK9g8Woppr1L_liPHpL-Ji1w2s",
  authDomain: "fir-auth-6491d.firebaseapp.com",
  projectId: "fir-auth-6491d",
  storageBucket: "fir-auth-6491d.appspot.com",
  messagingSenderId: "523202263793",
  appId: "1:523202263793:web:bf2bbce7ae6fe430a50750"
};

// Initialize Firebase
// let app;
// if(getApps().length === 0){
//     app = initializeApp(firebaseConfig);
// } else {
//     app = getApp();
// }
  const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth();

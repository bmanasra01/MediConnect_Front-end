// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; 

// const firebaseConfig = {
//   apiKey: "AIzaSyB07dZfVPkTJlNDOjTGqH4tLg4m5iz56Ek",
//   authDomain: "graduation-project-696d6.firebaseapp.com",
//   projectId: "graduation-project-696d6",
//   storageBucket: "graduation-project-696d6.appspot.com",
//   messagingSenderId: "471328975669",
//   appId: "1:471328975669:web:878459d5dcee376a513a7c",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app); 
// const db = getFirestore(app); 


// export { auth, createUserWithEmailAndPassword, db }; 


import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ استيراد Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB07dZfVPkTJlNDOjTGqH4tLg4m5iz56Ek",
  authDomain: "graduation-project-696d6.firebaseapp.com",
  projectId: "graduation-project-696d6",
  storageBucket: "graduation-project-696d6.appspot.com",
  messagingSenderId: "471328975669",
  appId: "1:471328975669:web:878459d5dcee376a513a7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ إنشاء التخزين السحابي

export { auth, createUserWithEmailAndPassword, db, storage }; // ✅ تصدير storage



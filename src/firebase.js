import { initializeApp } from "firebase/app";
import {getFirestore, collection, addDoc} from "@firebase/firestore"
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC-gDhdIlLJ9ubcN15qSFf52hKRmk406Fc",
  authDomain: "expense-manager-82daf.firebaseapp.com",
  projectId: "expense-manager-82daf",
  storageBucket: "expense-manager-82daf.appspot.com",
  messagingSenderId: "254602667346",
  appId: "1:254602667346:web:a5b6b6248b8b5a793e868b"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
export const auth = getAuth(app);
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD08pOCxssvHaMpCFhdSo35pQ_d_RLVEk8",
  authDomain: "commu-chat-app.firebaseapp.com",
  projectId: "commu-chat-app",
  storageBucket: "commu-chat-app.appspot.com",
  messagingSenderId: "924210964388",
  appId: "1:924210964388:web:f7c8948854f286cb9f8331",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseauth = getAuth(app);
const firestoredb = getFirestore(app);
const deleteData = async (collectionName, documentId) => {
  try {
    // ลบเอกสารโดยใช้ deleteDoc
    await deleteDoc(doc(firestoredb, collectionName, documentId));
    console.log("ลบเอกสารสำเร็จ");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบเอกสาร:", error);
  }
};

export { app, firebaseauth, firestoredb, deleteData };
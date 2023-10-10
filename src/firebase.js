import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyDPe4f8reuRCoLVFYDhqIl2Hzd9Vnf1ntw",
    authDomain: "contact-central-91fde.firebaseapp.com",
    projectId: "contact-central-91fde",
    storageBucket: "contact-central-91fde.appspot.com",
    messagingSenderId: "245407673340",
    appId: "1:245407673340:web:d28fcc4a3b8f5d11f2a079"
  };

const fireDb =firebase.initializeApp(firebaseConfig);
export default fireDb.database().ref();
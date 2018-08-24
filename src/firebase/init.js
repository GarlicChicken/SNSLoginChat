import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
    apiKey: "YOUR APP KEY",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };

const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true })

export default firebaseApp.firestore()



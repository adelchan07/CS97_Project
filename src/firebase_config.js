import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBv7ozkzyu-aKCU6xvEPQtHpUQXwnk4VZU",
    authDomain: "cs97-project-96457.firebaseapp.com",
    databaseURL: "https://cs97-project-96457-default-rtdb.firebaseio.com",
    projectId: "cs97-project-96457",
    storageBucket: "cs97-project-96457.appspot.com",
    messagingSenderId: "630717862838",
    appId: "1:630717862838:web:272be130a09285aeef6717"
};

try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack);
    }
}

const fb = firebase
export default fb;
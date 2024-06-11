
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyB-gaZwczm7gmyPY0OJnvgO4TKKsPYTJxU",
    authDomain: "expensetrackertmh.firebaseapp.com",
    projectId: "expensetrackertmh",
    storageBucket: "expensetrackertmh.appspot.com",
    messagingSenderId: "1074479106173",
    appId: "1:1074479106173:web:a1419a7290eb085c1fc914",
    measurementId: "G-62TTJ6LVZB"
};

const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);

export { fireDb, app };
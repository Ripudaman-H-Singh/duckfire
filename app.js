// 1. Import Firebase tools directly from the web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLUrj9EtCJDxmzvAFiG2qjMM41vgDvs6A",
  authDomain: "bluribus-fd.firebaseapp.com",
  projectId: "bluribus-fd",
  storageBucket: "bluribus-fd.firebasestorage.app",
  messagingSenderId: "792236877225",
  appId: "1:792236877225:web:b715b7310a4dcfd22050b8",
  measurementId: "G-48RSC5EB98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 3. Start up Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Connect to your HTML elements
const form = document.getElementById('book-form');
const bookList = document.getElementById('book-list');

// 5. Submit a new book to the database
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stops the page from reloading
    
    // Change the submit button so they know it's working
    const btn = form.querySelector('button');
    btn.textContent = "Saving...";

    try {
        await addDoc(collection(db, "books"), {
            reader: document.getElementById('readerName').value,
            title: document.getElementById('bookTitle').value,
            rating: document.getElementById('rating').value,
            comments: document.getElementById('comments').value,
            timestamp: serverTimestamp() // Helps us sort them newest-first
        });
        
        form.reset(); // Clear the form
        loadBooks();  // Refresh the list on the screen
    } catch (error) {
        console.error("Error adding book: ", error);
        alert("Oops, something went wrong!");
    } finally {
        btn.textContent = "Submit Book";
    }
});

// 6. Fetch and display all books
async function loadBooks() {
    bookList.innerHTML = '<p>Loading books...</p>'; 
    
    try {
        // Get books sorted by newest first
        const q = query(collection(db, "books"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        bookList.innerHTML = ''; // Clear the "Loading" text
        
        querySnapshot.forEach((doc) => {
            const book = doc.data();
            const article = document.createElement('article');
            article.innerHTML = `
                <header><strong>${book.title}</strong> - Rated: ${book.rating}/10</header>
                <p>"${book.comments}"</p>
                <footer><em>Read by: ${book.reader}</em></footer>
            `;
            bookList.appendChild(article);
        });
    } catch (error) {
        console.error("Error loading books: ", error);
        bookList.innerHTML = '<p>Error loading books. Check console.</p>';
    }
}

// 7. Load the books automatically when the page is opened
loadBooks();

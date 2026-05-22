import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Paste your Firebase config right here:
const firebaseConfig = {
  apiKey: "AIzaSyBLUrj9EtCJDxmzvAFiG2qjMM41vgDvs6A",
  authDomain: "bluribus-fd.firebaseapp.com",
  projectId: "bluribus-fd",
  storageBucket: "bluribus-fd.firebasestorage.app",
  messagingSenderId: "792236877225",
  appId: "1:792236877225:web:b715b7310a4dcfd22050b8",
  measurementId: "G-48RSC5EB98"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to HTML elements
const form = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const modal = document.getElementById('add-book-modal');
const openBtn = document.getElementById('open-modal-btn');
const closeBtn = document.getElementById('close-modal-btn');

// Open and Close Modal
openBtn.addEventListener('click', () => {
    modal.setAttribute('open', true);
});

closeBtn.addEventListener('click', () => {
    modal.removeAttribute('open');
});

// Helper function to draw the stars
function createStarVisual(ratingNumber) {
    const num = parseInt(ratingNumber);
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += (i <= num) ? "★" : "☆"; 
    }
    return `<span style="color: #ffc107; font-size: 1.2em;">${stars}</span>`;
}

// Submit a new book
form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const btn = form.querySelector('button');
    btn.textContent = "Saving...";

    try {
        await addDoc(collection(db, "books"), {
            reader: document.getElementById('readerName').value,
            title: document.getElementById('bookTitle').value,
            // This line specifically targets the new star radio buttons
            rating: document.querySelector('input[name="rating"]:checked').value,
            comments: document.getElementById('comments').value,
            timestamp: serverTimestamp() 
        });
        
        form.reset(); 
        modal.removeAttribute('open'); // Closes the pop-up
        loadBooks();  // Refreshes the list
    } catch (error) {
        console.error("Error adding book: ", error);
        alert("Oops, something went wrong!");
    } finally {
        btn.textContent = "Submit Book";
    }
});

// Fetch and display books
async function loadBooks() {
    bookList.innerHTML = '<p>Loading books...</p>'; 
    
    try {
        const q = query(collection(db, "books"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        bookList.innerHTML = ''; 
        
        querySnapshot.forEach((doc) => {
            const book = doc.data();
            const article = document.createElement('article');
            // Older 1-10 ratings will just show as 5 stars automatically without breaking
            article.innerHTML = `
                <header><strong>${book.title}</strong> - ${createStarVisual(book.rating)}</header>
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

// Load the books when page opens
loadBooks();

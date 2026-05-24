import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// DOM Elements - Stripped down to only what the Viewer needs
const bookList = document.getElementById('book-list');
const commentsModal = document.getElementById('comments-modal');
const longReviewDisplayContainer = document.getElementById('long-review-display-container');
const detailLongReview = document.getElementById('detail-long-review');
const closeCommentsBtn = document.getElementById('close-comments-btn');
const detailsModal = document.getElementById('details-modal');
const closeDetailsBtn = document.getElementById('close-details-btn');
const readerFilter = document.getElementById('reader-filter');

const curatedLibrary = {
    // January
    "01-01": { title: "Frankenstein", author: "Mary Shelley" },
    "01-02": { title: "Foundation", author: "Isaac Asimov" },
    "01-03": { title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
    "01-04": { title: "The Alchemist", author: "Paulo Coelho" },
    "01-05": { title: "The Bell Jar", author: "Sylvia Plath" },
    "01-06": { title: "Sherlock Holmes", author: "Arthur Conan Doyle" },
    "01-07": { title: "The Book Thief", author: "Markus Zusak" },
    "01-08": { title: "The Woman in White", author: "Wilkie Collins" },
    "01-09": { title: "Dune", author: "Frank Herbert" },
    "01-10": { title: "To Kill a Mockingbird", author: "Harper Lee" },
    "01-11": { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams" },
    "01-12": { title: "A Tale of Two Cities", author: "Charles Dickens" },
    "01-13": { title: "The Handmaid's Tale", author: "Margaret Atwood" },
    "01-14": { title: "1984", author: "George Orwell" },
    "01-15": { title: "Animal Farm", author: "George Orwell" },
    "01-16": { title: "Fahrenheit 451", author: "Ray Bradbury" },
    "01-17": { title: "Brave New World", author: "Aldous Huxley" },
    "01-18": { title: "Slaughterhouse-Five", author: "Kurt Vonnegut" },
    "01-19": { title: "The Tell-Tale Heart", author: "Edgar Allan Poe" },
    "01-20": { title: "Wuthering Heights", author: "Emily Brontë" },
    "01-21": { title: "Jane Eyre", author: "Charlotte Brontë" },
    "01-22": { title: "Sense and Sensibility", author: "Jane Austen" },
    "01-23": { title: "Emma", author: "Jane Austen" },
    "01-24": { title: "The Age of Innocence", author: "Edith Wharton" },
    "01-25": { title: "Mrs. Dalloway", author: "Virginia Woolf" },
    "01-26": { title: "To the Lighthouse", author: "Virginia Woolf" },
    "01-27": { title: "Alice's Adventures in Wonderland", author: "Lewis Carroll" },
    "01-28": { title: "Pride and Prejudice", author: "Jane Austen" },
    "01-29": { title: "The Secret Garden", author: "Frances Hodgson Burnett" },
    "01-30": { title: "Treasure Island", author: "Robert Louis Stevenson" },
    "01-31": { title: "Dracula", author: "Bram Stoker" },

    // February
    "02-01": { title: "The Color Purple", author: "Alice Walker" },
    "02-02": { title: "Ulysses", author: "James Joyce" },
    "02-03": { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    "02-04": { title: "Tender Is the Night", author: "F. Scott Fitzgerald" },
    "02-05": { title: "The Catcher in the Rye", author: "J.D. Salinger" },
    "02-06": { title: "Of Mice and Men", author: "John Steinbeck" },
    "02-07": { title: "The Grapes of Wrath", author: "John Steinbeck" },
    "02-08": { title: "East of Eden", author: "John Steinbeck" },
    "02-09": { title: "Catch-22", author: "Joseph Heller" },
    "02-10": { title: "A Farewell to Arms", author: "Ernest Hemingway" },
    "02-11": { title: "The Old Man and the Sea", author: "Ernest Hemingway" },
    "02-12": { title: "For Whom the Bell Tolls", author: "Ernest Hemingway" },
    "02-13": { title: "The Sun Also Rises", author: "Ernest Hemingway" },
    "02-14": { title: "Romeo and Juliet", author: "William Shakespeare" },
    "02-15": { title: "Macbeth", author: "William Shakespeare" },
    "02-16": { title: "Hamlet", author: "William Shakespeare" },
    "02-17": { title: "Othello", author: "William Shakespeare" },
    "02-18": { title: "Beloved", author: "Toni Morrison" },
    "02-19": { title: "Song of Solomon", author: "Toni Morrison" },
    "02-20": { title: "Invisible Man", author: "Ralph Ellison" },
    "02-21": { title: "Native Son", author: "Richard Wright" },
    "02-22": { title: "Things Fall Apart", author: "Chinua Achebe" },
    "02-23": { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez" },
    "02-24": { title: "Love in the Time of Cholera", author: "Gabriel García Márquez" },
    "02-25": { title: "The House of the Spirits", author: "Isabel Allende" },
    "02-26": { title: "Les Misérables", author: "Victor Hugo" },
    "02-27": { title: "The Count of Monte Cristo", author: "Alexandre Dumas" },
    "02-28": { title: "The Three Musketeers", author: "Alexandre Dumas" },
    "02-29": { title: "The Time Machine", author: "H.G. Wells" },

    // March
    "03-01": { title: "Don Quixote", author: "Miguel de Cervantes" },
    "03-02": { title: "Moby-Dick", author: "Herman Melville" },
    "03-03": { title: "The Scarlet Letter", author: "Nathaniel Hawthorne" },
    "03-04": { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
    "03-05": { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky" },
    "03-06": { title: "Anna Karenina", author: "Leo Tolstoy" },
    "03-07": { title: "War and Peace", author: "Leo Tolstoy" },
    "03-08": { title: "Little Women", author: "Louisa May Alcott" },
    "03-09": { title: "Madame Bovary", author: "Gustave Flaubert" },
    "03-10": { title: "The Picture of Dorian Gray", author: "Oscar Wilde" },
    "03-11": { title: "The Importance of Being Earnest", author: "Oscar Wilde" },
    "03-12": { title: "Heart of Darkness", author: "Joseph Conrad" },
    "03-13": { title: "Lord of the Flies", author: "William Golding" },
    "03-14": { title: "A Clockwork Orange", author: "Anthony Burgess" },
    "03-15": { title: "Lolita", author: "Vladimir Nabokov" },
    "03-16": { title: "The Master and Margarita", author: "Mikhail Bulgakov" },
    "03-17": { title: "Dr. Jekyll and Mr. Hyde", author: "Robert Louis Stevenson" },
    "03-18": { title: "Gulliver's Travels", author: "Jonathan Swift" },
    "03-19": { title: "Robinson Crusoe", author: "Daniel Defoe" },
    "03-20": { title: "The Odyssey", author: "Homer" },
    "03-21": { title: "The Iliad", author: "Homer" },
    "03-22": { title: "The Divine Comedy", author: "Dante Alighieri" },
    "03-23": { title: "The Canterbury Tales", author: "Geoffrey Chaucer" },
    "03-24": { title: "Paradise Lost", author: "John Milton" },
    "03-25": { title: "Beowulf", author: "Unknown" },
    "03-26": { title: "The Aeneid", author: "Virgil" },
    "03-27": { title: "Gilgamesh", author: "Unknown" },
    "03-28": { title: "The Hobbit", author: "J.R.R. Tolkien" },
    "03-29": { title: "The Silmarillion", author: "J.R.R. Tolkien" },
    "03-30": { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling" },
    "03-31": { title: "The Lion, the Witch and the Wardrobe", author: "C.S. Lewis" },

    // April
    "04-01": { title: "Good Omens", author: "Terry Pratchett & Neil Gaiman" },
    "04-02": { title: "American Gods", author: "Neil Gaiman" },
    "04-03": { title: "Coraline", author: "Neil Gaiman" },
    "04-04": { title: "Neverwhere", author: "Neil Gaiman" },
    "04-05": { title: "The Color of Magic", author: "Terry Pratchett" },
    "04-06": { title: "Mort", author: "Terry Pratchett" },
    "04-07": { title: "The Little Prince", author: "Antoine de Saint-Exupéry" },
    "04-08": { title: "Charlotte's Web", author: "E.B. White" },
    "04-09": { title: "Where the Wild Things Are", author: "Maurice Sendak" },
    "04-10": { title: "The Giving Tree", author: "Shel Silverstein" },
    "04-11": { title: "Matilda", author: "Roald Dahl" },
    "04-12": { title: "Charlie and the Chocolate Factory", author: "Roald Dahl" },
    "04-13": { title: "The BFG", author: "Roald Dahl" },
    "04-14": { title: "James and the Giant Peach", author: "Roald Dahl" },
    "04-15": { title: "A Wrinkle in Time", author: "Madeleine L'Engle" },
    "04-16": { title: "The Outsiders", author: "S.E. Hinton" },
    "04-17": { title: "The Giver", author: "Lois Lowry" },
    "04-18": { title: "Holes", author: "Louis Sachar" },
    "04-19": { title: "Bridge to Terabithia", author: "Katherine Paterson" },
    "04-20": { title: "Tuck Everlasting", author: "Natalie Babbitt" },
    "04-21": { title: "The Hunger Games", author: "Suzanne Collins" },
    "04-22": { title: "Catching Fire", author: "Suzanne Collins" },
    "04-23": { title: "Mockingjay", author: "Suzanne Collins" },
    "04-24": { title: "Divergent", author: "Veronica Roth" },
    "04-25": { title: "The Maze Runner", author: "James Dashner" },
    "04-26": { title: "Twilight", author: "Stephenie Meyer" },
    "04-27": { title: "The Fault in Our Stars", author: "John Green" },
    "04-28": { title: "Looking for Alaska", author: "John Green" },
    "04-29": { title: "Paper Towns", author: "John Green" },
    "04-30": { title: "The Perks of Being a Wallflower", author: "Stephen Chbosky" },

    // May
    "05-01": { title: "Life of Pi", author: "Yann Martel" },
    "05-02": { title: "The Kite Runner", author: "Khaled Hosseini" },
    "05-03": { title: "A Thousand Splendid Suns", author: "Khaled Hosseini" },
    "05-04": { title: "The Book Thief", author: "Markus Zusak" },
    "05-05": { title: "Water for Elephants", author: "Sara Gruen" },
    "05-06": { title: "The Help", author: "Kathryn Stockett" },
    "05-07": { title: "Memoirs of a Geisha", author: "Arthur Golden" },
    "05-08": { title: "The Secret Life of Bees", author: "Sue Monk Kidd" },
    "05-09": { title: "The Joy Luck Club", author: "Amy Tan" },
    "05-10": { title: "The Color of Water", author: "James McBride" },
    "05-11": { title: "Angela's Ashes", author: "Frank McCourt" },
    "05-12": { title: "The Glass Castle", author: "Jeannette Walls" },
    "05-13": { title: "Educated", author: "Tara Westover" },
    "05-14": { title: "Wild", author: "Cheryl Strayed" },
    "05-15": { title: "Into the Wild", author: "Jon Krakauer" },
    "05-16": { title: "Into Thin Air", author: "Jon Krakauer" },
    "05-17": { title: "A Walk in the Woods", author: "Bill Bryson" },
    "05-18": { title: "In Cold Blood", author: "Truman Capote" },
    "05-19": { title: "The Devil in the White City", author: "Erik Larson" },
    "05-20": { title: "Killers of the Flower Moon", author: "David Grann" },
    "05-21": { title: "Sapiens", author: "Yuval Noah Harari" },
    "05-22": { title: "Homo Deus", author: "Yuval Noah Harari" },
    "05-23": { title: "Goodnight Moon", author: "Margaret Wise Brown" },
    "05-24": { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
    "05-25": { title: "Outliers", author: "Malcolm Gladwell" },
    "05-26": { title: "The Tipping Point", author: "Malcolm Gladwell" },
    "05-27": { title: "Blink", author: "Malcolm Gladwell" },
    "05-28": { title: "Quiet", author: "Susan Cain" },
    "05-29": { title: "The Power of Habit", author: "Charles Duhigg" },
    "05-30": { title: "Atomic Habits", author: "James Clear" },
    "05-31": { title: "Dare to Lead", author: "Brené Brown" },

    // June
    "06-01": { title: "Daring Greatly", author: "Brené Brown" },
    "06-02": { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson" },
    "06-03": { title: "Man's Search for Meaning", author: "Viktor E. Frankl" },
    "06-04": { title: "The Four Agreements", author: "Don Miguel Ruiz" },
    "06-05": { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey" },
    "06-06": { title: "How to Win Friends and Influence People", author: "Dale Carnegie" },
    "06-07": { title: "Think and Grow Rich", author: "Napoleon Hill" },
    "06-08": { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki" },
    "06-09": { title: "The Intelligent Investor", author: "Benjamin Graham" },
    "06-10": { title: "A Brief History of Time", author: "Stephen Hawking" },
    "06-11": { title: "Cosmos", author: "Carl Sagan" },
    "06-12": { title: "The Selfish Gene", author: "Richard Dawkins" },
    "06-13": { title: "Guns, Germs, and Steel", author: "Jared Diamond" },
    "06-14": { title: "The Wright Brothers", author: "David McCullough" },
    "06-15": { title: "Alexander Hamilton", author: "Ron Chernow" },
    "06-16": { title: "Steve Jobs", author: "Walter Isaacson" },
    "06-17": { title: "Einstein", author: "Walter Isaacson" },
    "06-18": { title: "Leonardo da Vinci", author: "Walter Isaacson" },
    "06-19": { title: "The Diary of a Young Girl", author: "Anne Frank" },
    "06-20": { title: "Night", author: "Elie Wiesel" },
    "06-21": { title: "I Know Why the Caged Bird Sings", author: "Maya Angelou" },
    "06-22": { title: "Born a Crime", author: "Trevor Noah" },
    "06-23": { title: "Becoming", author: "Michelle Obama" },
    "06-24": { title: "A Promised Land", author: "Barack Obama" },
    "06-25": { title: "The Audacity of Hope", author: "Barack Obama" },
    "06-26": { title: "Long Walk to Freedom", author: "Nelson Mandela" },
    "06-27": { title: "The Autobiography of Malcolm X", author: "Malcolm X" },
    "06-28": { title: "Between the World and Me", author: "Ta-Nehisi Coates" },
    "06-29": { title: "Caste", author: "Isabel Wilkerson" },
    "06-30": { title: "The Warmth of Other Suns", author: "Isabel Wilkerson" },

    // July
    "07-01": { title: "The New Jim Crow", author: "Michelle Alexander" },
    "07-02": { title: "Just Mercy", author: "Bryan Stevenson" },
    "07-03": { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot" },
    "07-04": { title: "1776", author: "David McCullough" },
    "07-05": { title: "John Adams", author: "David McCullough" },
    "07-06": { title: "Team of Rivals", author: "Doris Kearns Goodwin" },
    "07-07": { title: "The Right Stuff", author: "Tom Wolfe" },
    "07-08": { title: "Band of Brothers", author: "Stephen E. Ambrose" },
    "07-09": { title: "Unbroken", author: "Laura Hillenbrand" },
    "07-10": { title: "Seabiscuit", author: "Laura Hillenbrand" },
    "07-11": { title: "The Boys in the Boat", author: "Daniel James Brown" },
    "07-12": { title: "Moneyball", author: "Michael Lewis" },
    "07-13": { title: "The Big Short", author: "Michael Lewis" },
    "07-14": { title: "Liar's Poker", author: "Michael Lewis" },
    "07-15": { title: "Freakonomics", author: "Steven D. Levitt" },
    "07-16": { title: "SuperFreakonomics", author: "Steven D. Levitt" },
    "07-17": { title: "The Black Swan", author: "Nassim Nicholas Taleb" },
    "07-18": { title: "Antifragile", author: "Nassim Nicholas Taleb" },
    "07-19": { title: "Zero to One", author: "Peter Thiel" },
    "07-20": { title: "The Lean Startup", author: "Eric Ries" },
    "07-21": { title: "Good to Great", author: "Jim Collins" },
    "07-22": { title: "Built to Last", author: "Jim Collins" },
    "07-23": { title: "Shoe Dog", author: "Phil Knight" },
    "07-24": { title: "The Innovator's Dilemma", author: "Clayton M. Christensen" },
    "07-25": { title: "Thinking in Systems", author: "Donella H. Meadows" },
    "07-26": { title: "Design of Everyday Things", author: "Don Norman" },
    "07-27": { title: "Clean Code", author: "Robert C. Martin" },
    "07-28": { title: "The Pragmatic Programmer", author: "Andrew Hunt" },
    "07-29": { title: "Code Complete", author: "Steve McConnell" },
    "07-30": { title: "Mythical Man-Month", author: "Frederick P. Brooks Jr." },
    "07-31": { title: "Snow Crash", author: "Neal Stephenson" },

    // August
    "08-01": { title: "Neuromancer", author: "William Gibson" },
    "08-02": { title: "Do Androids Dream of Electric Sheep?", author: "Philip K. Dick" },
    "08-03": { title: "The Man in the High Castle", author: "Philip K. Dick" },
    "08-04": { title: "Ubik", author: "Philip K. Dick" },
    "08-05": { title: "I, Robot", author: "Isaac Asimov" },
    "08-06": { title: "Ender's Game", author: "Orson Scott Card" },
    "08-07": { title: "Speaker for the Dead", author: "Orson Scott Card" },
    "08-08": { title: "Dune Messiah", author: "Frank Herbert" },
    "08-09": { title: "Children of Dune", author: "Frank Herbert" },
    "08-10": { title: "God Emperor of Dune", author: "Frank Herbert" },
    "08-11": { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin" },
    "08-12": { title: "The Dispossessed", author: "Ursula K. Le Guin" },
    "08-13": { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin" },
    "08-14": { title: "Hyperion", author: "Dan Simmons" },
    "08-15": { title: "The Fall of Hyperion", author: "Dan Simmons" },
    "08-16": { title: "Ringworld", author: "Larry Niven" },
    "08-17": { title: "Rendezvous with Rama", author: "Arthur C. Clarke" },
    "08-18": { title: "2001: A Space Odyssey", author: "Arthur C. Clarke" },
    "08-19": { title: "Childhood's End", author: "Arthur C. Clarke" },
    "08-20": { title: "Stranger in a Strange Land", author: "Robert A. Heinlein" },
    "08-21": { title: "The Moon is a Harsh Mistress", author: "Robert A. Heinlein" },
    "08-22": { title: "Starship Troopers", author: "Robert A. Heinlein" },
    "08-23": { title: "The Forever War", author: "Joe Haldeman" },
    "08-24": { title: "Old Man's War", author: "John Scalzi" },
    "08-25": { title: "Redshirts", author: "John Scalzi" },
    "08-26": { title: "The Martian", author: "Andy Weir" },
    "08-27": { title: "Project Hail Mary", author: "Andy Weir" },
    "08-28": { title: "Artemis", author: "Andy Weir" },
    "08-29": { title: "Dark Matter", author: "Blake Crouch" },
    "08-30": { title: "Recursion", author: "Blake Crouch" },
    "08-31": { title: "The Three-Body Problem", author: "Cixin Liu" },

    // September
    "09-01": { title: "The Dark Forest", author: "Cixin Liu" },
    "09-02": { title: "Death's End", author: "Cixin Liu" },
    "09-03": { title: "Leviathan Wakes", author: "James S.A. Corey" },
    "09-04": { title: "Caliban's War", author: "James S.A. Corey" },
    "09-05": { title: "Abaddon's Gate", author: "James S.A. Corey" },
    "09-06": { title: "The Name of the Wind", author: "Patrick Rothfuss" },
    "09-07": { title: "The Wise Man's Fear", author: "Patrick Rothfuss" },
    "09-08": { title: "Mistborn", author: "Brandon Sanderson" },
    "09-09": { title: "The Well of Ascension", author: "Brandon Sanderson" },
    "09-10": { title: "The Hero of Ages", author: "Brandon Sanderson" },
    "09-11": { title: "The Way of Kings", author: "Brandon Sanderson" },
    "09-12": { title: "Words of Radiance", author: "Brandon Sanderson" },
    "09-13": { title: "Oathbringer", author: "Brandon Sanderson" },
    "09-14": { title: "Rhythm of War", author: "Brandon Sanderson" },
    "09-15": { title: "A Game of Thrones", author: "George R.R. Martin" },
    "09-16": { title: "A Clash of Kings", author: "George R.R. Martin" },
    "09-17": { title: "A Storm of Swords", author: "George R.R. Martin" },
    "09-18": { title: "A Feast for Crows", author: "George R.R. Martin" },
    "09-19": { title: "A Dance with Dragons", author: "George R.R. Martin" },
    "09-20": { title: "The Blade Itself", author: "Joe Abercrombie" },
    "09-21": { title: "Before They Are Hanged", author: "Joe Abercrombie" },
    "09-22": { title: "Last Argument of Kings", author: "Joe Abercrombie" },
    "09-23": { title: "Assassin's Apprentice", author: "Robin Hobb" },
    "09-24": { title: "Royal Assassin", author: "Robin Hobb" },
    "09-25": { title: "Assassin's Quest", author: "Robin Hobb" },
    "09-26": { title: "The Lies of Locke Lamora", author: "Scott Lynch" },
    "09-27": { title: "Red Seas Under Red Skies", author: "Scott Lynch" },
    "09-28": { title: "The Republic of Thieves", author: "Scott Lynch" },
    "09-29": { title: "The Black Company", author: "Glen Cook" },
    "09-30": { title: "Gardens of the Moon", author: "Steven Erikson" },

    // October
    "10-01": { title: "Deadhouse Gates", author: "Steven Erikson" },
    "10-02": { title: "Memories of Ice", author: "Steven Erikson" },
    "10-03": { title: "House of Leaves", author: "Mark Z. Danielewski" },
    "10-04": { title: "The Haunting of Hill House", author: "Shirley Jackson" },
    "10-05": { title: "We Have Always Lived in the Castle", author: "Shirley Jackson" },
    "10-06": { title: "It", author: "Stephen King" },
    "10-07": { title: "The Shining", author: "Stephen King" },
    "10-08": { title: "The Stand", author: "Stephen King" },
    "10-09": { title: "Misery", author: "Stephen King" },
    "10-10": { title: "Pet Sematary", author: "Stephen King" },
    "10-11": { title: "Carrie", author: "Stephen King" },
    "10-12": { title: "Salem's Lot", author: "Stephen King" },
    "10-13": { title: "The Silence of the Lambs", author: "Thomas Harris" },
    "10-14": { title: "Red Dragon", author: "Thomas Harris" },
    "10-15": { title: "Hannibal", author: "Thomas Harris" },
    "10-16": { title: "Gone Girl", author: "Gillian Flynn" },
    "10-17": { title: "Sharp Objects", author: "Gillian Flynn" },
    "10-18": { title: "Dark Places", author: "Gillian Flynn" },
    "10-19": { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson" },
    "10-20": { title: "The Girl Who Played with Fire", author: "Stieg Larsson" },
    "10-21": { title: "The Girl Who Kicked the Hornet's Nest", author: "Stieg Larsson" },
    "10-22": { title: "Big Little Lies", author: "Liane Moriarty" },
    "10-23": { title: "The Husband's Secret", author: "Liane Moriarty" },
    "10-24": { title: "The Silent Patient", author: "Alex Michaelides" },
    "10-25": { title: "The Da Vinci Code", author: "Dan Brown" },
    "10-26": { title: "Angels & Demons", author: "Dan Brown" },
    "10-27": { title: "Inferno", author: "Dan Brown" },
    "10-28": { title: "Origin", author: "Dan Brown" },
    "10-29": { title: "The Girl on the Train", author: "Paula Hawkins" },
    "10-30": { title: "Into the Water", author: "Paula Hawkins" },
    "10-31": { title: "And Then There Were None", author: "Agatha Christie" },

    // November
    "11-01": { title: "Murder on the Orient Express", author: "Agatha Christie" },
    "11-02": { title: "Death on the Nile", author: "Agatha Christie" },
    "11-03": { title: "The ABC Murders", author: "Agatha Christie" },
    "11-04": { title: "The Mysterious Affair at Styles", author: "Agatha Christie" },
    "11-05": { title: "The Murder of Roger Ackroyd", author: "Agatha Christie" },
    "11-06": { title: "A Study in Scarlet", author: "Arthur Conan Doyle" },
    "11-07": { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle" },
    "11-08": { title: "The Sign of the Four", author: "Arthur Conan Doyle" },
    "11-09": { title: "The Valley of Fear", author: "Arthur Conan Doyle" },
    "11-10": { title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle" },
    "11-11": { title: "In the Woods", author: "Tana French" },
    "11-12": { title: "The Likeness", author: "Tana French" },
    "11-13": { title: "Faithful Place", author: "Tana French" },
    "11-14": { title: "The Secret History", author: "Donna Tartt" },
    "11-15": { title: "The Goldfinch", author: "Donna Tartt" },
    "11-16": { title: "The Little Friend", author: "Donna Tartt" },
    "11-17": { title: "A Man Called Ove", author: "Fredrik Backman" },
    "11-18": { title: "Beartown", author: "Fredrik Backman" },
    "11-19": { title: "Anxious People", author: "Fredrik Backman" },
    "11-20": { title: "My Grandmother Asked Me to Tell You She's Sorry", author: "Fredrik Backman" },
    "11-21": { title: "Britt-Marie Was Here", author: "Fredrik Backman" },
    "11-22": { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman" },
    "11-23": { title: "Where the Crawdads Sing", author: "Delia Owens" },
    "11-24": { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid" },
    "11-25": { title: "Daisy Jones & The Six", author: "Taylor Jenkins Reid" },
    "11-26": { title: "Malibu Rising", author: "Taylor Jenkins Reid" },
    "11-27": { title: "Normal People", author: "Sally Rooney" },
    "11-28": { title: "Conversations with Friends", author: "Sally Rooney" },
    "11-29": { title: "Beautiful World, Where Are You", author: "Sally Rooney" },
    "11-30": { title: "The Midnight Library", author: "Matt Haig" },

    // December
    "12-01": { title: "How to Stop Time", author: "Matt Haig" },
    "12-02": { title: "The Humans", author: "Matt Haig" },
    "12-03": { title: "Circe", author: "Madeline Miller" },
    "12-04": { title: "The Song of Achilles", author: "Madeline Miller" },
    "12-05": { title: "A Thousand Ships", author: "Natalie Haynes" },
    "12-06": { title: "The Silence of the Girls", author: "Pat Barker" },
    "12-07": { title: "Station Eleven", author: "Emily St. John Mandel" },
    "12-08": { title: "The Glass Hotel", author: "Emily St. John Mandel" },
    "12-09": { title: "Sea of Tranquility", author: "Emily St. John Mandel" },
    "12-10": { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin" },
    "12-11": { title: "The Storied Life of A.J. Fikry", author: "Gabrielle Zevin" },
    "12-12": { title: "Lessons in Chemistry", author: "Bonnie Garmus" },
    "12-13": { title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab" },
    "12-14": { title: "A Darker Shade of Magic", author: "V.E. Schwab" },
    "12-15": { title: "Vicious", author: "V.E. Schwab" },
    "12-16": { title: "The Night Circus", author: "Erin Morgenstern" },
    "12-17": { title: "The Starless Sea", author: "Erin Morgenstern" },
    "12-18": { title: "The Ocean at the End of the Lane", author: "Neil Gaiman" },
    "12-19": { title: "Stardust", author: "Neil Gaiman" },
    "12-20": { title: "The Graveyard Book", author: "Neil Gaiman" },
    "12-21": { title: "Norse Mythology", author: "Neil Gaiman" },
    "12-22": { title: "The Shadow of the Wind", author: "Carlos Ruiz Zafón" },
    "12-23": { title: "The Angel's Game", author: "Carlos Ruiz Zafón" },
    "12-24": { title: "The Prisoner of Heaven", author: "Carlos Ruiz Zafón" },
    "12-25": { title: "A Christmas Carol", author: "Charles Dickens" },
    "12-26": { title: "Great Expectations", author: "Charles Dickens" },
    "12-27": { title: "David Copperfield", author: "Charles Dickens" },
    "12-28": { title: "Oliver Twist", author: "Charles Dickens" },
    "12-29": { title: "Bleak House", author: "Charles Dickens" },
    "12-30": { title: "Hard Times", author: "Charles Dickens" },
    "12-31": { title: "The Pickwick Papers", author: "Charles Dickens" }
};

// 2. The Background Fetcher
async function setDailyBackground() {
    const today = new Date();
    
    // Format today's date as MM-DD to match our list
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;

    // Look up the book, or use Dune as a permanent fallback if the date is empty
    const dailyBook = curatedLibrary[dateKey] || { title: "Dune", author: "Frank Herbert" };

    // Format the date text (e.g., "Saturday, May 23, 2026")
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    // Update the HTML banner
    document.getElementById('daily-date').textContent = today.toLocaleDateString(undefined, dateOptions);
    document.getElementById('daily-title').textContent = dailyBook.title;
    document.getElementById('daily-author').textContent = dailyBook.author;

    // Fetch the cover from Google Books using your existing API Key
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(dailyBook.title)}+inauthor:${encodeURIComponent(dailyBook.author)}&key=AIzaSyD1KdbXzv4xCpy5a6VfA5Gyio6ctRwf5Ek`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            let coverUrl = data.items[0].volumeInfo?.imageLinks?.thumbnail;
            if (coverUrl) {
                // Upgrade to a secure, slightly larger image link
                coverUrl = coverUrl.replace('http:', 'https:').replace('&zoom=1', '&zoom=0');
                // We removed the background override here!
            }
        }
    } catch (error) {
        console.error("Failed to fetch daily cover: ", error);
    }
}

// Trigger the function immediately when the page loads
setDailyBackground();

// Modal Toggles
closeDetailsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    detailsModal.close();
});
closeCommentsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    commentsModal.close();
});

// Star Rating Helper
function createStarVisual(ratingNumber) {
    const num = parseInt(ratingNumber);
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += (i <= num) ? "★" : "☆"; 
    }
    return `<span style="color: #ffc107; font-size: 1.2em;">${stars}</span>`;
}

// Load & Render Books with Covers
async function loadBooks() {
    bookList.innerHTML = '<p style="color: var(--text-muted);">Loading books...</p>'; 
    
    try {
        const q = query(collection(db, "books"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        bookList.innerHTML = ''; 
        
        querySnapshot.forEach((docSnap) => {
            const book = docSnap.data();
            const bookId = docSnap.id;
            const article = document.createElement('article');
            article.setAttribute('data-reader', book.reader || 'Unknown');
            
            article.style.cursor = 'pointer';
            article.style.padding = '0'; 
            article.style.overflow = 'hidden';

            const displayCover = book.coverUrl || 'https://via.placeholder.com/128x192.png?text=No+Cover&bg=1e332a&text_color=e2f0e9';

            // Top Half: Book Details
            const detailsDiv = document.createElement('div');
            detailsDiv.style.padding = '1rem';
            detailsDiv.innerHTML = `
                <div style="display: flex; gap: 15px; align-items: center;">
                    <img src="${displayCover}" class="book-cover" alt="Cover">
                    <div style="flex-grow: 1; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; flex-direction: column;">
                            <h4 style="margin: 0 0 6px 0; line-height: 1.2;">${book.title}</h4>
                            <small style="color: var(--text-muted);">by ${book.reader || 'Unknown'}</small>
                        </div>
                        <div style="margin-top: 0; white-space: nowrap;">${createStarVisual(book.rating)}</div>
                    </div>
                </div>
            `;
            detailsDiv.addEventListener('click', () => openBookDetails(book));

            // Bottom Half: Comments Divider
            const commentsDiv = document.createElement('div');
            commentsDiv.style.padding = '0.75rem 1rem';
            commentsDiv.style.borderTop = '1px solid var(--border-color)';
            commentsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'; 
            commentsDiv.style.fontSize = '0.9rem';
            commentsDiv.style.color = 'var(--accent-color)';
            const commentCount = book.discussion ? book.discussion.length : 0;
            commentsDiv.innerHTML = `Read Discussion (${commentCount})`;
            commentsDiv.addEventListener('click', () => openCommentsThread(book));

            article.appendChild(detailsDiv);
            article.appendChild(commentsDiv);
            bookList.appendChild(article);
        });
    } catch (error) {
        console.error("Error loading books: ", error);
        bookList.innerHTML = '<p style="color: var(--text-muted);">Error loading books. Check console.</p>';
    }
}

// Function 1: Opens the Top Details Modal (Read-Only)
function openBookDetails(bookData) {
    document.getElementById('detail-title').textContent = bookData.title;
    document.getElementById('detail-author').textContent = `Read by: ${bookData.reader || 'Unknown'}`;
    document.getElementById('detail-review').textContent = `"${bookData.comments || 'No initial review.'}"`;
    
    const coverEl = document.getElementById('detail-cover');
    if (bookData.coverUrl) {
        coverEl.src = bookData.coverUrl;
        coverEl.style.display = 'block';
    } else {
        coverEl.style.display = 'none';
    }

    if (bookData.longReview) {
        longReviewDisplayContainer.style.display = 'block';
        detailLongReview.textContent = bookData.longReview;
    } else {
        longReviewDisplayContainer.style.display = 'none';
    }
    
    detailsModal.showModal();
}

// Function 2: Opens the Bottom Discussion Modal (Read-Only)
function openCommentsThread(bookData) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    if (bookData.discussion && bookData.discussion.length > 0) {
        bookData.discussion.forEach(comment => {
            const date = new Date(comment.timestamp).toLocaleString();
            commentsList.innerHTML += `
                <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
                    <small style="color: var(--text-muted);">${date}</small>
                    <p style="margin: 5px 0 0 0;">${comment.text}</p>
                </div>
            `;
        });
    } else {
        commentsList.innerHTML = '<p style="color: var(--text-muted);">No comments yet.</p>';
    }
    
    commentsModal.showModal();
}

// Live Reader Filter Logic
readerFilter.addEventListener('input', (e) => {
    const filterText = e.target.value.toLowerCase().trim();
    const articles = bookList.querySelectorAll('article');
    
    articles.forEach(article => {
        const readerName = article.getAttribute('data-reader').toLowerCase();
        if (readerName.includes(filterText)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
});

// Initialize App
loadBooks();

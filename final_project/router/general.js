const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const booksList = await getBooks();
        return res.status(200).json({ books: booksList });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books list" });
    }
});

// Simulate an asynchronous function to fetch books (e.g., from a database or API)
async function getBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);
    });
}

// Get book details based on ISBN (Async-Await example)
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const book = await getBookByISBN(req.params.isbn);
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Simulate an asynchronous function to get book by ISBN
async function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            resolve(book);
        }, 1000);
    });
}

// Get book details based on author (Async-Await example)
public_users.get('/author/:author', async function (req, res) {
    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);
        if (booksByAuthor.length > 0) {
            return res.status(200).json({ books: booksByAuthor });
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Simulate an asynchronous function to get books by author
async function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = Object.values(books).filter(book => book.author === author);
            resolve(matchingBooks);
        }, 1000);
    });
}

// Get all books based on title (Async-Await example)
public_users.get('/title/:title', async function (req, res) {
    try {
        const booksByTitle = await getBooksByTitle(req.params.title);
        if (booksByTitle.length > 0) {
            return res.status(200).json({ books: booksByTitle });
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// Simulate an asynchronous function to get books by title
async function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = Object.values(books).filter(book => book.title === title);
            resolve(matchingBooks);
        }, 1000);
    });
}


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json({ reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;

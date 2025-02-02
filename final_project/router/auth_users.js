const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "testingkey";

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    // Save token in session
    req.session.token = token;

    return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    const decoded = jwt.verify(req.session.token, SECRET_KEY);
    const username = decoded.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ updateddata: books[isbn], message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review (Only by the user who posted it)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    const decoded = jwt.verify(req.session.token, SECRET_KEY);
    const username = decoded.username;

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found to delete" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ updateddata: books[isbn], message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

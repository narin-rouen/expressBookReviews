const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json({ reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

/* TASKS 10-13: Implementing Async/Await and Promises */

// Task 10: Get all books using async/await
public_users.get("/async/books", async (req, res) => {
    try {
        const response = await axios.get("https://example.com/books");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Task 11: Get book details by ISBN using Promises
public_users.get("/isbn_async/:isbn", (req, res) => {
    axios.get(`https://example.com/books/${req.params.isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(500).json({ error: error.message }));
});

// Task 12: Get books by author using async/await
public_users.get("/author_async/:author", async (req, res) => {
    try {
        const response = await axios.get("https://example.com/books");
        const booksByAuthor = response.data.filter(book => book.author.toLowerCase() === req.params.author.toLowerCase());
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Task 13: Get books by title using Promises
public_users.get("/title_async/:title", (req, res) => {
    axios.get("https://example.com/books")
        .then(response => {
            const booksByTitle = response.data.filter(book => book.title.toLowerCase() === req.params.title.toLowerCase());
            res.status(200).json(booksByTitle);
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

module.exports.general = public_users;

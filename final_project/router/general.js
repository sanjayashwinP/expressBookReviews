const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* TASK 10 – Get all books using ASYNC / AWAIT */
public_users.get('/books', async (req, res) => {
    try {
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

/* TASK 11 – Get book by ISBN using PROMISES */
public_users.get('/books/isbn/:isbn', (req, res) => {
    Promise.resolve(books)
        .then(data => {
            const book = data[req.params.isbn];
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        });
});

/* TASK 12 – Get books by AUTHOR using ASYNC / AWAIT */
public_users.get('/books/author/:author', async (req, res) => {
    const author = req.params.author;
    const result = Object.values(books).filter(
        book => book.author === author
    );

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

/* TASK 13 – Get books by TITLE using PROMISES */
public_users.get('/books/title/:title', (req, res) => {
    Promise.resolve(books)
        .then(data => {
            const title = req.params.title;
            const result = Object.values(data).filter(
                book => book.title === title
            );
            res.status(200).json(result);
        });
});

/* TASK 5 – Get book review (SAFE VERSION) */
public_users.get('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn] && books[isbn].reviews) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(200).json({});
    }
});

/* TASK 6 – Register new user */
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    res.status(200).json({ message: "User successfully registered" });
});

module.exports.general = public_users;

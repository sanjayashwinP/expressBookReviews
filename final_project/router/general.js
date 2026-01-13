const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    if (isValid(username)) {
        users.push({ username, password });
        return res.status(200).json({ message: "User successfully registered" });
    }

    return res.status(400).json({ message: "Invalid username" });
});

public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const result = [];

    for (let key in books) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    }

    return res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const result = [];

    for (let key in books) {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    }

    return res.status(200).json(result);
});

public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;

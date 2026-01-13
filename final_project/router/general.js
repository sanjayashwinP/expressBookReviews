const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/* TASK 10 – Get all books using async/await with Axios */
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

/* TASK 11 – Get book by ISBN using PROMISES + Axios */
public_users.get('/isbn/:isbn', (req, res) => {
    axios.get("http://localhost:5000/")
        .then(response => {
            const book = response.data[req.params.isbn];
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: "Book not found for given ISBN" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book by ISBN" });
        });
});

/* TASK 12 – Get books by AUTHOR using async/await + EXPLICIT FILTERING */
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        const author = req.params.author;

        const filteredBooks = Object.values(response.data).filter(
            book => book.author === author
        );

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found for given author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

/* TASK 13 – Get books by TITLE using PROMISES + EXPLICIT FILTERING */
public_users.get('/title/:title', (req, res) => {
    axios.get("http://localhost:5000/")
        .then(response => {
            const title = req.params.title;

            const filteredBooks = Object.values(response.data).filter(
                book => book.title === title
            );

            if (filteredBooks.length > 0) {
                res.status(200).json(filteredBooks);
            } else {
                res.status(404).json({ message: "No books found for given title" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books by title" });
        });
});

/* Get book review */
public_users.get('/review/:isbn', (req, res) => {
    res.status(200).json(books[req.params.isbn].reviews);
});

/* Register new user */
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

module.exports.general = public_users;

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

/* TASK 11 – Get book by ISBN using Promises with Axios */
public_users.get('/isbn/:isbn', (req, res) => {
    axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => res.status(500).json({ message: "Error fetching ISBN" }));
});

/* TASK 12 – Get books by author using async/await with Axios */
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${req.params.author}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Author not found" });
    }
});

/* TASK 13 – Get books by title using Promises with Axios */
public_users.get('/title/:title', (req, res) => {
    axios.get(`http://localhost:5000/title/${req.params.title}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => res.status(500).json({ message: "Title not found" }));
});

/* Other routes remain unchanged */

public_users.get('/review/:isbn', (req, res) => {
    res.status(200).json(books[req.params.isbn].reviews);
});

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: "Username and password required" });

    if (users.find(u => u.username === username))
        return res.status(409).json({ message: "User already exists" });

    users.push({ username, password });
    res.status(200).json({ message: "User successfully registered" });
});

module.exports.general = public_users;

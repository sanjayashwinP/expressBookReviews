const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});


public_users.get('/async/isbn/:isbn', (req, res) => {
    axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => res.status(500).json({ message: "Error fetching ISBN" }));
});

/* TASK 12 – Get books by author using async/await */
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        res.status(200).json(response.data);
    } catch {
        res.status(500).json({ message: "Error fetching author" });
    }
});


public_users.get('/async/title/:title', (req, res) => {
    axios.get(`http://localhost:5000/title/${req.params.title}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => res.status(500).json({ message: "Error fetching title" }));
});



public_users.get('/', (req, res) => {
    res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
    res.status(200).json(books[req.params.isbn]);
});

public_users.get('/author/:author', (req, res) => {
    const result = [];
    Object.keys(books).forEach(key => {
        if (books[key].author === req.params.author) {
            result.push(books[key]);
        }
    });
    res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
    const result = [];
    Object.keys(books).forEach(key => {
        if (books[key].title === req.params.title) {
            result.push(books[key]);
        }
    });
    res.status(200).json(result);
});

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

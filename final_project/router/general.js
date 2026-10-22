const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Provide username and password."});
});

// Task 1 & 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books list" });
  }
});

// Task 2 & 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBook
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 3 & 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve) => {
        const matchingBooks = [];
        for (let key in books) {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[key]);
          }
        }
        resolve(matchingBooks);
      });
    };

    const bookList = await getBooksByAuthor();
    if (bookList.length > 0) {
      return res.status(200).json(bookList);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 4 & 13: Get book details based on Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = () => {
      return new Promise((resolve) => {
        const matchingBooks = [];
        for (let key in books) {
          if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(books[key]);
          }
        }
        resolve(matchingBooks);
      });
    };

    const bookList = await getBooksByTitle();
    if (bookList.length > 0) {
      return res.status(200).json(bookList);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let library = [];

// GET method to retrieve the full contents of the library
app.get('/get/library', (req, res) => {
    getBookList(library, 0, (books) => {
      res.send(books);
    });
  });

// POST method to add book
app.post('/add/book', (req, res) => {
  let { book } = req.body;
  if (!book || typeof book !== 'string') {
    return res.status(400).send('Invalid book name/type');
  }

  if (library.includes(book)) {
    return res.status(400).send('Book already exists');
  }

  library.push(book);
  res.sendStatus(200);
});

// DELETE method to remove a book from the library
app.delete('/remove/book', (req, res) => {
  let { book } = req.body;
  let index = library.indexOf(book);
  if (index === -1) {
    return res.status(404).send('Book is not found');
  }

  library.splice(index, 1);
  res.sendStatus(200);
});

// PATCH method to update the name of an existing book
app.patch('/update/book', (req, res) => {
  let { original_book, new_book } = req.body;
  let index = library.indexOf(original_book);
  if (index === -1) {
    return res.status(404).send('Book is not found');
  }

  if (library.includes(new_book)) {
    return res.status(400).send('Book already exists');
  }

  library[index] = new_book;
  res.sendStatus(200);
});


// PUT method to simulate saving books to a database
app.put('/saveto/database', (req, res) => {
  let responseObj = {};

  function saveItemOnDatabase(name, callback) {
    let delayTime = Math.random() * name.length;
    setTimeout(() => {
      let elapsed = Date.now() - startTime;
      responseObj[name] = elapsed;
      callback();
    }, delayTime);
  }

  let startTime = Date.now();
  let promises = library.map((book) => {
    return new Promise((resolve) => {
      saveItemOnDatabase(book, resolve);
    });
  });

  Promise.all(promises).then(() => {
    res.json(responseObj);
  });
});

// Asynchronous function to get the book list
function getBookList(list, index, callback) {
  if (index === list.length) {
    return callback(list.join(', '));
  }
  callback(list[index], () => {
    getBookList(list, index + 1, callback);
  });
}

// Starting the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

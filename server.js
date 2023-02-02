const express = require('express');
const path = require('path');
const fs = require('fs');
const note = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.port || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes for API/notes
app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json'))
);

// post to add new note
app.post('/api/notes', (req, res) => {
    const note = JSON.parse(fs.readFileSync('./db/db.json'));
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
            
        };

        note.push(newNote);

        const response = {
            status: 'success',
            body: newNote,
            
        };

        console.log(response);
        res.status(201).json(response);
      } else {
        res.status(500).json('Error in posting note');
      }


    fs.writeFileSync('./db/db.json', JSON.stringify(note), "utf-8");
    res.json(note);
});

//delete notes

// remove note by req.params.id, json, 
// filter by id
app.delete('/api/notes/:id', (req, res) => {

});

// GET HTML Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET HTML Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
    console.log(`Listening on http://localhost:${PORT} 🚀`)
);
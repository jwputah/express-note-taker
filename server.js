// Required npm packages
const fs = require("fs");
const path = require("path");
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./Develop/db/db');
// const apiRoutes = require('./Develop/public/assets/js/index.js');
// const htmlRoutes = require('./Develop/public/index.html');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// app.use(express.static('public'));

// Generate short unique id (uuid)
const uid = new ShortUniqueId({ length: 3 });

// function to create a note
function newNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, "./Develop/db/db.json"),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}

// Api routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.uid = ShortUniqueId();
    const note = newNote(req.body, notes);
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
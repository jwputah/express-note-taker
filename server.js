// Required npm packages
const fs = require("fs");
const path = require("path");
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./Develop/db/db');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// middleware function to serve static files in public folder
app.use(express.static('Develop/public'));

// Generate a unique id 
const generateUniqueId = require('generate-unique-id');

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
    req.body.id = generateUniqueId({ length: 3 });
    const note = createNewNote(req.body, notes);
    res.json(note);
});

// Delete note function
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const delNote = notes.findIndex(note => note.id == id);
    notes.splice(delNote, 1);
    return res.send();
});

// function to create a note
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, "./Develop/db/db.json"),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
};

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
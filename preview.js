const express = require('express');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
let inputport;
for (const arg of args) {
    if (arg.startsWith('--port=')) inputport = arg.split('=')[1];
}

const app = express();
const port = inputport ? inputport : 8080;

const projectspage = 'index.html';

app.use(express.static(path.join(__dirname, 'build/html/')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/html', projectspage));
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite database setup
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create votes table
db.run(
    `CREATE TABLE IF NOT EXISTS votes (
        name TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
    )`
);

// Initialize classmates
const classmates = ['Alice', 'Bob', 'Charlie', 'Diana'];
classmates.forEach((name) => {
    db.run(`INSERT OR IGNORE INTO votes (name, count) VALUES (?, ?)`, [name, 0]);
});

// Get votes
app.get('/votes', (req, res) => {
    db.all('SELECT * FROM votes', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Update vote count
app.post('/vote', (req, res) => {
    const { name } = req.body;
    db.run(
        `UPDATE votes SET count = count + 1 WHERE name = ?`,
        [name],
        function (err) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.send({ message: 'Vote recorded.' });
            }
        }
    );
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

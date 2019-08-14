const express = require('express');
const mysql = require('mysql');
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect((err) => {
    console.log('connected to db');
    app.listen(PORT, () => {
        console.log('listening on port ' + PORT);
    });
});


const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//TODO Update html
app.get("/api/users", (req, res) => {
    client.query("SELECT * FROM users ORDER BY id asc", (err, result) => {
        console.log(result.rows);
        res.json(result.rows);
    });

});

app.post('/api/newuser', (req, res) => {
    const userInput = req.body;
    let sql = `INSERT INTO users (first, last, email, age) VALUES ('${userInput.first}', '${userInput.last}', '${userInput.email}', ${userInput.age})`;

    client.query(sql, (err) => {
        if ( err )
            console.log(err);
        else
            console.log('1 row inserted');
        res.json('success')
    });

});

app.put('/api/:id', (req, res) => {
    const userID = req.params.id;
    const userInput = req.body;

    let sql = `UPDATE users SET first = '${userInput.first}', last = '${userInput.last}', email = '${userInput.email}', age = ${userInput.age} WHERE id = ${userID};`;

    client.query(sql, (err) => {
        if ( err )
            throw err;
        else
            res.json('success')
    });
});

app.delete('/api/:id', (req, res) => {
    const userID = req.params.id;

    let sql = `DELETE FROM users WHERE id = ${userID};`;

    client.query(sql, (err) => {
        if ( err )
            console.log(err);
        else
            console.log('1 row deleted');
        res.json('success')
    });
});


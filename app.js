const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
// const path = require('path');
let id;

const PORT = process.env.PORT || 8080;

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1Woodenskelf!",
    database: "usermanager",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

const defaultUsers = [
    { name: "Billy", email: "Billy@bob.com", age: 23 },
    { name: "Jane", email: "Jane@yahoo.com", age: 55 },
    { name: "Wendy", email: "Wendy@aol.com", age: 65 },
    { name: "Tim", email: "billy@gmail.com", age: 34 },
    { name: "Sam", email: "Tim@bob.gmail", age: 26 },
    { name: "John", email: "John@bob.aol", age: 62 },
    { name: "Billy", email: "Billy@hotmail.com", age: 73 },
    { name: "Meg", email: "Meg@yahoo.com", age: 24 },
    { name: "Cassandra", email: "Cassandra@gmail.com", age: 35 },
    { name: "Thomas", email: "Thomas@gmail.com", age: 45 },
    { name: "Brian", email: "Brian@aol.com", age: 44 },

];

function addDefaultUsers() {
    let id = 1;
    defaultUsers.forEach((user) => {
        let sql = `INSERT INTO users (name, email, age, usernumber) VALUES ('${user.name}', '${user.email}', ${user.age}, ${id})`;

        id++;
        connection.query(sql, (err) => {
            if ( err )
                console.log(err);
        });
    });
}

connection.connect((err) => {
    if ( err )
        console.log(err);
    console.log('connected to db');
    connection.query('SELECT MAX(ID) FROM users LIMIT 1', (err, result) => {
        id = result[0]['MAX(ID)'];
        if ( id === null ) {
            addDefaultUsers();
        } else {
            id++
        }


    });


});

// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);

});


app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));

});

app.get('/getUsers', (req, res) => {

    connection.query("SELECT * FROM users", (err, result) => {
        res.json(result);
    });

});

app.post('/', (req, res) => {
    const userInput = req.body;
    console.log(userInput);

    let sql = `INSERT INTO users (name, email, age, usernumber) VALUES ('${userInput.name}', '${userInput.email}', ${userInput.age}, ${id})`;

    connection.query(sql, (err) => {
        if ( err )
            console.log(err);
        else
            console.log('1 row inserted');
        res.json('success')
    });

});
app.put('/:id', (req, res) => {
    const userID = req.params.id;
    const userInput = req.body;

    let sql = `UPDATE users SET name = '${userInput.name}', email = '${userInput.email}', age = ${userInput.age} WHERE Id = ${userID};`;
    console.log(sql);

    connection.query(sql, (err) => {
        if ( err )
            console.log(err);
        else
            console.log('1 row updated');
        res.json('success')
    });
});


app.delete('/:id', (req, res) => {
    const userID = req.params.id;


    let sql = `DELETE FROM users WHERE Id = ${userID};`;

    connection.query(sql, (err) => {
        if ( err )
            console.log(err);
        else
            console.log('1 row deleted');
        res.json('success')
    });
});


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require("./db");
const collection = "users";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getUsers', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if ( err )
            console.log(err);
        else {
            res.json(documents);
        }
    });
});

app.put('/:id', (req, res) => {
    const userID = req.params.id;
    const userInput = req.body;

    db.getDB()
        .collection(collection)
        .findOneAndUpdate(
            { _id: db.getPrimaryKey(userID) },
            { $set: { name: userInput.name, email: userInput.email, age: userInput.age } },
            { returnOriginal: false },
            (err, result) => {
                if ( err )
                    console.log(err);
                else
                    res.json(result);
            });
});


app.post('/', (req, res) => {
    const userInput = req.body;
    console.log(userInput);
    db.getDB()
        .collection(collection)
        .insertOne(userInput, (err, result) => {
            if ( err )
                console.log(err);
            else
                res.json({ result: result, document: result.ops[0] })
        })
});

app.delete('/:id', (req, res) => {
    const todoID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete(
        { _id: db.getPrimaryKey(todoID) },
        (err, result) => {
            if ( err )
                console.log(err);
            else
                res.json(result);
        });
});

db.connect((err) => {
    if ( err ) {
        console.log("Unable to connect to database");
        process.exit(1);
    } else {
        app.listen(3000, () => {
            console.log("Connected to Database, app Listening on port 3000");
        });
    }
});

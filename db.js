const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = 'tim_db';
const url = "mongodb://localhost:27017";
const mongoOptions = { useNewUrlParser: true };

const state = {
    db: null
};

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

// MongoClient.connect(url, function(err, client) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
//
//     const db = client.db(dbName);
//
//     client.close();
// });

const connect = (cb) => {
    if ( state.db )
        cb();
    else {
        MongoClient.connect(url, mongoOptions, (err, client) => {
            if ( err )
                cb(err);
            else {
                state.db = client.db(dbname);

                state.db.collection("users").find({}).toArray((err, documents) => {
                    if ( err )
                        console.log(err);
                    else if ( documents.length === 0 ) {
                            defaultUsers.forEach((user) => {
                                state.db.collection("users").insertOne(user, (err, result) => {
                                    if ( err )
                                        console.log(err);
                                    else
                                        console.log('successful insert');
                                })
                            });
                        }

                });


                cb();
            }
        });
    }
};

const getPrimaryKey = (_id) => {
    return ObjectID(_id)
};

const getDB = () => {
    return state.db;
};

module.exports = { getDB, connect, getPrimaryKey };
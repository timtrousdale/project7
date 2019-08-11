const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = 'tim_db';
const url = "mongodb://localhost:27017";
const mongoOptions = { useNewUrlParser: true };

const state = {
    db: null
};



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
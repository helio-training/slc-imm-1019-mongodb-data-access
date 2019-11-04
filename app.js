const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const assert = require('assert');
require('dotenv').config()

// Connection URL
const url = process.env.ATLAS_CONNECTION

// Database Name
const dbName = 'rolodex';
const settings = {
    useUnifiedTopology: true
}

const testConnection = () => {
    // Use connect method to connect to the server
    MongoClient.connect(url, settings, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        console.log("client", client)
        console.log("db", db)
        client.close();
    });
}

const createContact = (contact) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, settings, function (err, client) {
        assert.equal(null, err);
        console.log("Connected to server for Creation of Contact");

        const db = client.db(dbName);
        // Get the contacts collection
        const collection = db.collection('contacts');
        // Insert a document
        collection.insertOne(contact, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted a document into the collection");
            client.close();
        });
        
    });
}

const readContacts = () => {
    // Use connect method to connect to the server
    MongoClient.connect(url, settings, function (err, client) {
        assert.equal(null, err);
        console.log("Connected to server Read Contacts");

        const db = client.db(dbName);
        // Get the contacts collection
        const collection = db.collection('contacts');
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs)
            client.close();
        });
    });
}

const updateContact = (id, contact) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, settings, function (err, client) {
        assert.equal(null, err);
        console.log("Connected to server to Update a Contact");

        const db = client.db(dbName);
        // Get the contacts collection
        const collection = db.collection('contacts');
        // Insert a document
        collection.updateOne({ '_id': ObjectId(id) }, 
            { $set: { ...contact } },
            function (err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Updated a document in the collection");
                client.close();
        });

    });
}

const deleteContact = (name) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, settings, function (err, client) {
        assert.equal(null, err);
        console.log("Connected to server to Delete a Contact");

        const db = client.db(dbName);
        // Get the contacts collection
        const collection = db.collection('contacts');
        // Insert a document
        collection.deleteMany({ 'name': name },
            function (err, result) {
                assert.equal(err, null);
                console.log("Delete documents in the collection");
                client.close();
            });

    });
}

const newContact = {
    "name": "George",
    "email": "test@test.test",
    "phone": "000-000-0000"
}
const changeContact = {
    "name": "Wesley"
}
const updateID = '5dc04def1c9d4400000e7530'
const main = () => {
    testConnection()
    createContact(newContact)
    readContacts()
    updateContact(updateID, changeContact)
    deleteContact('George')
}

main()

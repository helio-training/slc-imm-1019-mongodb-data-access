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
    const iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if(err){
                // assert.equal(null, err);
                reject(err)
            } else {
                const db = client.db(dbName);
                // console.log("client", client)
                // console.log("db", db)
                client.close();
                resolve("Connected successfully to server")
            }
        });
    })
    return iou
}

const createContact = (contact) => {
    // Use connect method to connect to the server
    let iou = new Promise ((resolve, reject) =>{

        MongoClient.connect(url, settings, function (err, client) {
            if(err){
                reject(err)
            }
            else { 
                console.log("Connected to server for Creation of Contact");
                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('contacts');
                // Insert a document
                collection.insertOne(contact, function (err, result) {
                    if(err){
                        reject(err)
                    }
                    else{
                        client.close();
                        resolve("Inserted a document into the collection");
                    }
                   
                });
            } 
        })
    });
    return iou
}

const readContacts = () => {
    let iou = new Promise((resolve, reject) => {
    // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if(err){
            reject(err)
            }else{
                console.log("Connected to server Read Contacts");

                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('contacts');
                // Find some documents
                collection.find({}).toArray(function (err, docs) {
                    if(err){
                        reject(err)
                    }else{
                        const results = {
                            data: docs,
                            msg: "Found the following records"
                        }
                        
                        client.close();
                        resolve(results);
                    }
                });
            }
        });
    })
    return iou;
}

const updateContact = (id, contact) => {
    let iou = new Promise((resolve, reject) => {
        
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            }
            else{
                console.log("Connected to server to Update a Contact");

                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('contacts');
                // Insert a document
                collection.updateOne({ '_id': ObjectId(id) }, 
                    { $set: { ...contact } },
                    function (err, result) {
                        if(err){
                            reject(err)
                        }  else{
                            client.close();
                            resolve("Updated a document in the collection");
                        }
                });
            }
        });
    })
    return iou
}

const deleteContact = (name) => {
    let iou = new Promise ((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if(err){
               reject(err) 
            } else {
                console.log("Connected to server to Delete a Contact");
                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('contacts');
                // Insert a document
                collection.deleteMany({ 'name': name },
                    function (err, result) {
                        if(err){
                            reject(err)
                        } else {
                            client.close();
                            resolve("Delete documents in the collection")
                        }
                        
                    });
            }          
       }); 
    })
    return iou
};


const newContact = {
    "name": "George",
    "email": "test@test.test",
    "phone": "000-000-0000"
}
const changeContact = {
    "name": "Wesley"
}
const updateID = '5dc04def1c9d4400000e7530'
const main = async () => {
    console.log(await testConnection())
    console.log('----------------------- Post Test')
    console.log(await createContact(newContact))
    console.log('----------------------- Post Create')
    console.log(await readContacts())
    console.log('----------------------- Post Read')
    console.log(await updateContact(updateID, changeContact))
    console.log('----------------------- Post Update')
    console.log(await deleteContact('George'))
    console.log('----------------------- Post Delete')
    console.log(await readContacts())
    console.log('----------------------- Post Read')

}

main()

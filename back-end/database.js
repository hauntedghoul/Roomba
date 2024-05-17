const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://roomba:Roomba01@cluster0.fm4mkz2.mongodb.net/";
const client = new MongoClient(uri);

function addUser(user, pass) {
    try {
        const database = client.db('Roomba');
        const users = database.collection("User");

        const doc = {
            Username: user,
            Password: pass
        }

        const result = users.insertOne(doc);
        console.log('Inserted');
    } finally {
        client.close();
    }
}

function viewAllLog() {
    
}

function openLog() {

}
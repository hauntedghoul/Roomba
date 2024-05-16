const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://roomba:Roomba01@cluster0.fm4mkz2.mongodb.net/";
const client = new MongoClient(uri);

const database = client.db('Roomba');
const users = database.collection("User")
const logs = database.collection("Logs")

function addUser(user, pass) {
    
}

function viewAllLog() {

}

function openLog() {

}
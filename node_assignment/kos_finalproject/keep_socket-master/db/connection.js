// write your db connection code here
const mongoose = require('mongoose');
 
function createMongoConnection(){
 return mongoose.connect('mongodb://localhost:27017/testDB', {useNewUrlParser: true});
}

function getMongoConnection(){
    return mongoose.connection;
}

function onError(err){
    console.log("error in database"+err);
}

function onSuccess(){
    console.log("Successfully Connected ");
}

module.exports = {
    createMongoConnection,
    getMongoConnection,
    onError,
    onSuccess
};
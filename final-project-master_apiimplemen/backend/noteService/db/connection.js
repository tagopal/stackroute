const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://docker_demo_mongodb:27017/user_notes';
//console.log('MONGO_URL', MONGO_URL);

function createMongoConnection() {
    return mongoose.connect(MONGO_URL, {
        useCreateIndex: true,
        useNewUrlParser: true
    });
}

function getMongoConnection() {
    return mongoose.connection;
}

function onError(err) {
    console.log("Error in database connection " + err);
}

function onSuccess() {
    console.log('Connected to mongo database');
}

module.exports = {
    createMongoConnection
}
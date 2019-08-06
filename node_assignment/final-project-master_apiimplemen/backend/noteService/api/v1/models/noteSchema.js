const mongoose = require('mongoose');

//user id of people,note shared
let sharedWithSchema = new mongoose.Schema({
    sharedWith: {
        type: mongoose.Types.ObjectId
    },
    userName: {
        type: String
    }
});

let noteSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    reminder: {
        type: Date
    },
    reminderId: {
        type: Object
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    label: {
        type: String
    },
    favourite: {
        type: Boolean,
        default: false
    },
    labels: [{
        type: String
    }],
    sharedTo: [sharedWithSchema]
});

module.exports = mongoose.model('notes', noteSchema);
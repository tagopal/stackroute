const mongoose = require('mongoose');

let sharedNoteSchema = new mongoose.Schema({
    shareUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    sharedName: {
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
    ownerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SharedNotes', sharedNoteSchema);
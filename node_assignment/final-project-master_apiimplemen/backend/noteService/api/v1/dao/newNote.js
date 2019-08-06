const notesDB = require('../models/noteSchema');

// new note handler
const newNote = (req, res) => {
    return new Promise((resolve, reject) => {
        //console.log("Inside the newNote DAO req.body.ownerId :", req.body.ownerId);
        //new note instance
        let note = new notesDB();
        note.ownerId = req.body.ownerId || null;
        note.ownerName = req.body.ownerName || null;
        note.title = req.body.title || null;
        note.text = req.body.text || null;
        note.created = req.body.created || new Date;
        req.body.reminder != null || undefined ? note.reminder = req.body.reminder : '';
        req.body.updated != null || undefined ? note.updated = req.body.updated : '';
        note.favourite = req.body.favourite || false;
        note.sharedTo = req.body.shared || [];
        note.labels = req.body.labels || [];
        note.save((err, note) => {
            if (err) {
                console.log("Inside save error  :", err);
                reject({
                    message: "Unexpected error, Try after sometime",
                    status: 500
                });
            }
            resolve({
                message: "Successfully created",
                status: 201,
                data: note
            });
        });
    });
};

module.exports = newNote;
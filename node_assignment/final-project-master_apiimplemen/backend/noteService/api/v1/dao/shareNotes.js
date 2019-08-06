const sharednotesDB = require('../models/sharedNoteSchema');

const shareAll = (data) => {
    return new Promise((resolve, reject) => {
        //console.log("data  :", data);
        data.sharedTo.forEach(value => {
            let sharedNote = new sharednotesDB();
            sharedNote.shareUserId = value._id;
            sharedNote.sharedName = value.userName;
            sharedNote.title = data.title;
            sharedNote.text = data.text;
            sharedNote.ownerId = data.ownerId;
            sharedNote.ownerName = data.ownerName;
            sharedNote.created = data.created;

            sharedNote.save((err, note) => {
                if (err) {
                    console.log("Inside save error  :", err);
                    reject({
                        message: "Unexpected error, Try after sometime",
                        status: 500
                    });
                }
            });
        });
        resolve({
            message: "Successfully created Users",
            status: 201
        });
    });
}

module.exports = shareAll;
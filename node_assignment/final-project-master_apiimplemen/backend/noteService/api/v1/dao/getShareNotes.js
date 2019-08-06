const sharednotesDB = require('../models/sharedNoteSchema');
const mongoose = require('mongoose');
const getShare = (data) => {
    return new Promise((resolve, reject) => {
        sharednotesDB.find({
            'shareUserId': mongoose.Types.ObjectId(data)
        }, (err, note) => {
            if (err) {
                //console.log("Inside save error  :", err);
                reject({
                    message: "Unexpected error, Try after sometime",
                    status: 500
                });
            }
            resolve({
                message: "Successfully created Users",
                status: 201,
                notes: note
            });
        });
    });
}
module.exports = getShare;
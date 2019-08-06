const notesDB = require('../models/noteSchema');

const deleteNote = (data) => {
    return new Promise((resolve, reject) => {
        data.forEach(value => {
            notesDB.remove({
                _id: value._id
            }, (err, result) => {
                if (err) {
                    reject({
                        message: "Unexpected error, Try after sometime",
                        status: 500
                    });
                }
            });
        });
        resolve(true);
    });
};

module.exports = deleteNote;
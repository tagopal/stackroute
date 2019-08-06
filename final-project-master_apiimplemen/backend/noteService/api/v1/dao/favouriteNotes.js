const notesDB = require('../models/noteSchema');

const favouriteNote = (req, res) => {
    return new Promise((resolve, reject) => {
        console.log("Inside favouriteNote dao");
        notesDB.update({
            _id: {
                $in: req.body.notesId
            }
        }, {
            $set: {
                favourite: req.body.favourite
            }
        }, {
            multi: true
        }, (err, result) => {
            if (err) {
                //console.log("Inside favouriteNote update error  :", err.message);
                reject({
                    message: "Unexpected error, Try after sometime",
                    status: 500
                });
            }
            resolve({
                message: "successfully favourite",
                status: 201
            });
        });
    });
};

module.exports = favouriteNote;
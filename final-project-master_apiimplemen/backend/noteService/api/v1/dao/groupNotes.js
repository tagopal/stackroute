const notesDB = require('../models/noteSchema');

const groupNote = (req, res) => {
    return new Promise((resolve, reject) => {
        //console.log("Inside groupNote dao");
        notesDB.update({
            _id: {
                $in: req.body.notesId
            }
        }, {
            $set: {
                label: req.params.label
            }
        }, {
            multi: true
        }, (err, result) => {
            if (err) {
                //console.log("Inside groupNote update error  :", err.message);
                reject({
                    message: "Unexpected error, Try after sometime",
                    status: 500
                });
            }
            resolve({
                message: "successfully grouped",
                status: 201
            });
        });
    });
};

module.exports = groupNote;
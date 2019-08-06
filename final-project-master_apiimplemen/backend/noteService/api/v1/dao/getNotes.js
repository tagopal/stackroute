const notesDB = require('../models/noteSchema');

const getNotes = (req, res) => {
    return new Promise((resolve, reject) => {
            //console.log("Inside getNotes dao req.params.ownerId) :", req.params.ownerId);
        notesDB.find({
            ownerId: req.params.ownerId
        }, (err, result) => {
            if (err) {
                //console.log("Inside getNotes findById error  :", err.message);
                reject({
                    message: "Unexpected error, Try after sometime",
                    status: 500
                });
            }
            if (result.length > 0) {
                resolve({
                    message: "Successfully Sent notes",
                    status: 200,
                    data: result
                });
            }
            resolve({
                message: "Create note to view",
                status: 200,
                data: result
            });
        });
    });
};

module.exports = getNotes;
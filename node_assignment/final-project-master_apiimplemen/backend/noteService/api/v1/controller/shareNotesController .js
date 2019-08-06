const shareNotesDao = require('../dao/shareNotes');

const shareNoteFunction = (req, res) => {
        //console.log("Inside the newNoteFunction :", req.body);
    shareAll(req.body).then(response => {
        // console.log("register Controller response  :",response);
        res.status(response.status).json({
            message: response.message,
            data: response.data
        });
    }).catch(err => {
        res.status(err.status).send(err.message);
    });
};

module.exports = shareNoteFunction;
const getNotesDao = require('../dao/groupNotes');

const groupNoteFunction = (req, res) => {
    getNotesDao(req, res).then(result => {
        res.status(result.status).send(result.message);
    }).catch(error => {
        res.status(error.status).send(error.message);
    });
};

module.exports = groupNoteFunction;
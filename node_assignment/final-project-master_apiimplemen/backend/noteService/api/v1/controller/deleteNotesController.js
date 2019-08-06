const deleteNotesDao = require('../dao/deleteNotes');

const deleteFunction = (req, res) => {
    deleteNotesDao(req, res).then(result => {
        res.status(result.status).send(result.message);
    }).catch(error => {
        res.status(error.status).send(error.message);
    });
};
module.exports = deleteFunction;
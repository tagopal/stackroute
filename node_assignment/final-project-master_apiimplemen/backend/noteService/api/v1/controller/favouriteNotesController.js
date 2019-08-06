const favoriteNotesDao = require('../dao/favouriteNotes');

const favouriteFunction = (req, res) => {
    favoriteNotesDao(req, res).then(result => {
        res.status(result.status).send(result.message);
    }).catch(err => {
        res.status(error.status).send(error.message);
    });
};
module.exports = favouriteFunction;
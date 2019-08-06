const getNotesDao = require('../dao/getNotes');

const getNotesFunction = (req, res) => {
    //console.log("Inside the getNotesFunction :", req.params);
    getNotesDao(req, res).then(response => {
        // console.log("register Controller response  :",response);
        res.status(response.status).json({
            message: response.message,
            data: response.data
        });
    }).catch(err => {
        res.status(err.status).send(err.message);
    });
};
module.exports = getNotesFunction;
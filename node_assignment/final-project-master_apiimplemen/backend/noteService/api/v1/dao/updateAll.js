const notesDB = require('../models/noteSchema');

const updateAll = (data) => {
    return new Promise((resolve, reject) => {
        data.forEach(value => {
            //console.log("value ;", value);
            notesDB.findByIdAndUpdate(value._id, value, (err, result) => {
                if (err) {
                    reject(err);
                } else {}
            });
        });
        resolve(true);
    });
};

module.exports = updateAll;
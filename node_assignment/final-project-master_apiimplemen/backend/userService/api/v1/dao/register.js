const userdb = require('../models/userSchema');
const bcrypt = require('../utils/bcryptModule');

const register = (req, res) => {
    return new Promise((resolve, reject) => {
        userdb.find({
            userName: req.body.username
        }, (err, result) => {
            if (err) {
                reject({
                    message: "Unexpected error, Try after sometime",
                    status: 500
                });
            }
            if (result.length > 0) {
                reject({
                    message: "Username already exists",
                    status: 401
                });
            } else {                
                let user = new userdb();
                user.userName = req.body.username;
                user.password = bcrypt.getHashedPassword(req.body.password);
                user.firstName = req.body.firstname;
                user.lastName = req.body.lastname;
                user.save((err, newuser) => {
                    if (err) {
                          reject(err);
                    }
                    resolve(newuser);
                });
            }
        });
    });
};

module.exports = register;
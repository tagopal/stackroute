const userdb = require('../models/userSchema');
const bcrypt = require('../utils/bcryptModule');
const jwtsign = require('../utils/authJwt').jwtSign;

const login = (req, res) => {
    return new Promise((resolve, reject) => {
        userdb.findOne({
            userName: req.body.username
        }, (err, result) => {
            if (err) {
                reject({
                    message: "Unexpected error, Try after sometime",
                    status: 500
                });
            }
            if (result && bcrypt.comparePassword(req.body.password, result.password)) {
                //passing hashed password for jwt token
                jwtsign({
                    userName: req.body.username,
                    password: result.password
                }).then(tokenValid => {
                    userdb.find({
                        userName: {
                            $ne: req.body.username
                        }
                    }).select('userName').exec((err, result2) => {
                        if (err) {
                            reject({
                                message: "Unexpected error, Try after sometime",
                                status: 500
                            });
                        }
                        resolve({
                            message: "Valid user",
                            status: 201,
                            token: tokenValid,
                            username: result.userName,
                            id: result._id,
                            friendsList: result2
                        });
                    });
                }).catch(err => {
                    console.log("Inside jwt error :", err);
                    reject({
                        message: "Unexpected error, In creating token",
                        status: 500
                    });
                });
            } else if (!result) {
                reject({
                    message: "Not a user",
                    status: 401
                });
            } else {
                reject({
                    message: "password mismatch",
                    status: 401
                });
            }
        });
    });
};

module.exports = login;
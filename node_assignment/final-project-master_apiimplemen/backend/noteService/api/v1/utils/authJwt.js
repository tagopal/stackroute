const jwt = require('jsonwebtoken');
const config = require('../../../config').config.jwtSpecification;

const jwtVerify = (token) => {
    return new Promise((resolve, reject) => {
        // console.log("Config  :",config);
        // console.log("token :",token);
        jwt.verify(token, config.secretKey, {
            algorithm: config.algorithm
        }, (err, response) => {
            if (err) {
                console.log("error  :", err);
                reject(err);
            }
            resolve(true);
        });
    });
};

module.exports = jwtVerify;
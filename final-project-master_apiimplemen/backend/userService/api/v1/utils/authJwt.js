const jwt = require('jsonwebtoken');
const config = require('../../../config').config.jwtSpecification;

const jwtSign = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.secretKey, {
            expiresIn: config.expiresIn,
            algorithm: config.algorithm
        }, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });
};

const jwtVerify = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secretKey, {
            algorithm: config.algorithm
        }, (err, response) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};

module.exports = {
    jwtSign,
    jwtVerify
};
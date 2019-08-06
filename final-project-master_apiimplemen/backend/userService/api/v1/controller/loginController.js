const loginDao = require('../dao/login');

const loginFunction = (req, res) => {
    loginDao(req, res).then(response => {
        res.status(response.status).json({
            message: response.message,
            token: response.token,
            data: response
        });
    }).catch(err => {
        res.status(err.status).send(err.message);
    });
};

module.exports = loginFunction;
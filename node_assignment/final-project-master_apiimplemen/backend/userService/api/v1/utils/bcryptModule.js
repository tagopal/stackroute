const bcrypt = require('bcryptjs');

const getHashedPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const comparePassword = (inputPassword, dbPassword) => {
    return bcrypt.compareSync(inputPassword, dbPassword);
};

module.exports = {
    getHashedPassword,
    comparePassword
};
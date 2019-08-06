const registerDao = require('../dao/register');

const registerFunction = (req, res) => {
	registerDao(req, res).then(response => {
		// console.log("register Controller response  :",response);
		res.status(201).send({
			message: "new user created"
		});
	}).catch(err => {
		if ((err.name === 'MongoError' && err.code === 11000) || err.status === 401) {
			res.status(201).send({
				code: 11000,
				message: "Username already exist."
			});
		} else {
			res.status(500).send(err);
		}
	});
};

module.exports = registerFunction;
const router = require('express').Router();
const controllers = require('../controller');

router.post('/register', controllers.registerController);
router.post('/login', controllers.loginController);

module.exports = router;
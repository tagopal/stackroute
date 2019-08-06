const router = require('express').Router();
const users = require('../users/users.dao');
const notes = require('../notes/notes.dao');
const userInfo = require('../userInfo/userInfo.dao');
const auth = require('../auth/auth')
const authController = require('../auth')

router.post('/users/register',users.register);
router.post('/users/login',users.login);
router.get('/users/register',users.getUsers);

router.post('/isAuthenticated',authController.VerifyToken);

router.get('/allNotes',auth.authenticate,notes.getAllNotes);
router.get('/notes',auth.authenticate,notes.getNotes);
router.post('/notes',auth.authenticate,notes.addNotes);
router.put('/notes',auth.authenticate,notes.updateNotes);
router.post('/notes/remove',auth.authenticate,notes.removeNotes);

router.get('/userInfo',auth.authenticate,userInfo.getUserInfo);
router.post('/userInfo',auth.authenticate,userInfo.setUserInfo);
router.post('/removeUserInfo',auth.authenticate,userInfo.removeUserInfo);



module.exports = router;

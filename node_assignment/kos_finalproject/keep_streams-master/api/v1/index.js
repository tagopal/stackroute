const router = require('express').Router();
const users = require('./users/users.dao');
const notes = require('./notes/notes.dao');
const auth = require('../auth/auth')

router.post('/users/register',users.register);
router.post('/users/login',users.login);
router.get('/users/register',users.getUsers);

router.get('/notes',auth.authenticate,notes.getNotes);
router.post('/notes',auth.authenticate,notes.addNotes);
router.put('/notes/:id',auth.authenticate,notes.updateNotes);
router.get('/notes/stream',auth.authenticate,notes.getStreamNotes)
router.post('/notes/stream',auth.authenticate,notes.addStreamNotes);
router.post('/notes/share',auth.authenticate,notes.shareNotes);


module.exports = router;

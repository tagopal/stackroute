const router = require('express').Router();
const controllers = require('../controller');

//checking purpose
router.get('/check', (req, res) => {
    res.send("works");
});

//poste single note
router.post('/', controllers.newNoteController);

router.post('/api/v1/share_note', controllers.shareNotesController);

//get all notes of particular user
router.get('/:ownerId', controllers.getNotesController);

//to update the favourite column in the each note as single or bulk upload
router.put('/favourite', controllers.favouriteNotesController);

//group single or multiple notes to a particular label
router.post('/group/:label', controllers.groupNotesController);

//remove single or multiple notes and also deletes if shared with others
router.delete('/', controllers.deleteNotesController);

module.exports = router;
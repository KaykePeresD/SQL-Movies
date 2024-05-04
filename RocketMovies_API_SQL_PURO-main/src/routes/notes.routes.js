const { Router } = require('express');

const NotesContronller = require('../controllers/NotesController');
const notesController = new NotesContronller();

const notesRoutes = Router();

notesRoutes.get('/', notesController.index);
notesRoutes.post('/:user_id', notesController.create);
notesRoutes.get('/:id', notesController.show);
notesRoutes.delete('/:id', notesController.delete);



module.exports = notesRoutes;
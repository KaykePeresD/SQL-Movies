const { Router } = require('express');

const TagsContronller = require('../controllers/TagsController');
const tagsController = new TagsContronller();

const tagsRoutes = Router();

tagsRoutes.get('/:user_id', tagsController.index);

module.exports = tagsRoutes;
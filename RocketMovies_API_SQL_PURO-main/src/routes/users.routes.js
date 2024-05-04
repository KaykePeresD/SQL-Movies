const { Router } = require('express');

const UsersContronller = require('../controllers/UsersController');
const usersController = new UsersContronller();

const usersRoutes = Router();

usersRoutes.post('/', usersController.create);
usersRoutes.put('/:id', usersController.update);

module.exports = usersRoutes;
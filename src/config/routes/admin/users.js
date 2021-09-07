const express = require('express')();
const Admin = require('../../../services/middleware/Admin');

const {
    create,
    edit,
    remove,
    changePassword,
    getUser,
    getUsers
} = require('../../../controllers/admin/users/UsersController');

/* BEGIN ROUTES */

express.post('/create', Admin, create);
express.put('/edit', Admin, edit);
express.delete('/delete', Admin, remove);
express.put('/change-password', Admin, changePassword);
express.get('/getUser', Admin, getUser);
express.get('/getUsers', Admin, getUsers);


module.exports.AdminUsersRoutes = express;
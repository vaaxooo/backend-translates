const express = require('express')();
const Admin = require('../../../services/middleware/Admin');

const {
    create,
    edit,
    remove
} = require('../../../controllers/admin/prices/PricesController');

/* BEGIN ROUTES */

express.post('/add', Admin, create);
express.put('/edit', Admin, edit);
express.delete('/delete', Admin, remove);

module.exports.PricesRoutes = express;
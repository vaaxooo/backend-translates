const express = require('express')();
const Admin = require('../../../services/middleware/Admin');

const {
    create,
    edit,
    remove,
    getPrice,
    getPrices
} = require('../../../controllers/admin/prices/PricesController');

/* BEGIN ROUTES */

express.post('/add', Admin, create);
express.put('/edit', Admin, edit);
express.delete('/delete', Admin, remove);
express.get('/getPrice', Admin, getPrice);
express.get('/getPrices', Admin, getPrices);

module.exports.PricesRoutes = express;
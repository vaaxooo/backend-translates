const express = require('express')();
const Admin = require('../../../services/middleware/Admin');

const {
    edit,
    remove,
    getOrders,
    getOrder
} = require('../../../controllers/admin/orders/OrdersController');

/* BEGIN ROUTES */

express.put('/edit', Admin, edit);
express.delete('/delete', Admin, remove);
express.get('/getOrder', Admin, getOrder);
express.get('/getOrders', Admin, getOrders)

module.exports.AdminOrdersRoutes = express;
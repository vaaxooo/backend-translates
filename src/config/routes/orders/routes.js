const express = require('express')();
const Auth = require('../../../services/middleware/Auth');

const {
    create,
    edit,
    remove,
    getOrder,
    getOrders
} = require('../../../controllers/orders/OrdersController');

/* BEGIN ROUTES */

express.post('/create', Auth, create);
express.put('/edit', Auth, edit);
express.get('/getOrder', Auth, getOrder);
express.get('/getOrders', Auth, getOrders)
/*express.delete('/delete', Auth, remove);*/

module.exports.OrdersRoutes = express;
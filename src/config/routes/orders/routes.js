const express = require('express')();
const Auth = require('../../../services/middleware/Auth');

const {
    create,
    edit,
    remove,
    getOrder,
    getOrders,
} = require('../../../controllers/orders/OrdersController');

/* BEGIN ROUTES */

express.post('/create', create);
express.put('/edit', edit);
express.get('/getOrder', getOrder);
express.get('/getOrders', getOrders)
/*express.delete('/delete', Auth, remove);*/

module.exports.OrdersRoutes = express;
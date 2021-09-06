const express = require('express')();
const Auth = require('../../../services/middleware/Auth');

const {
    create,
    edit,
    remove
} = require('../../../controllers/orders/OrdersController');

/* BEGIN ROUTES */

express.post('/create', Auth, create);
express.put('/edit', Auth, edit);
/*express.delete('/delete', Auth, remove);*/

module.exports.OrdersRoutes = express;
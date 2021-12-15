const express = require('express')();
const Admin = require('../../../services/middleware/Admin');

const {
    edit,
    remove,
    getOrders,
    getOrder,
    setProcess,
    setStatus,
    getTransactions
} = require('../../../controllers/admin/orders/OrdersController');

/* BEGIN ROUTES */

/**
 * @openapi
 * /api/admin/orders/edit:
 *   put:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
express.put('/edit', Admin, edit);
express.delete('/delete', Admin, remove);
express.get('/getOrder', Admin, getOrder);
express.get('/getOrders', Admin, getOrders);
express.get('/process', Admin, setProcess);
express.get('/status', Admin, setStatus);

express.get('/transactions', Admin, getTransactions);

module.exports.AdminOrdersRoutes = express;
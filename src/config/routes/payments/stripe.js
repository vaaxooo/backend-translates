const express = require('express')();

const {
    create,
    success,
    cancel,
    poprey
} = require('../../../controllers/payments/StripeController');

/* BEGIN ROUTES */

express.get('/create', create);
express.get('/success', success);
express.get('/cancel', cancel);


/* POPREY */
express.post('/create-order', poprey);

module.exports.StripeRoutes = express;
const express = require('express')();

const {
    create,
    success,
    cancel,
    poprey,
    popreySuccess,
    popreyCancel
} = require('../../../controllers/payments/StripeController');

/* BEGIN ROUTES */

express.get('/create', create);
express.get('/success', success);
express.get('/cancel', cancel);


/* POPREY */
express.post('/create-order', poprey);
express.get('/success-order', popreySuccess);
express.get('/cancel-order', popreyCancel);

module.exports.StripeRoutes = express;
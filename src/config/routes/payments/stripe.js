const express = require('express')();

const {
    create,
    success,
    cancel
} = require('../../../controllers/payments/StripeController');

/* BEGIN ROUTES */

express.get('/create', create);
express.get('/success', success);
express.get('/cancel', cancel);

module.exports.StripeRoutes = express;
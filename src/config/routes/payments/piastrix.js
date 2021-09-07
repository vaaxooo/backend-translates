const express = require('express')();

const {
    create,
    callback
} = require('../../../controllers/payments/PiastrixController');

/* BEGIN ROUTES */

express.get('/create', create);
express.get('/callback', callback);

module.exports.PiastrixRoutes = express;
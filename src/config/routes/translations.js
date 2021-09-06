const express = require('express')();
const Admin = require('../../../services/middleware/Admin');

const {
    getTranslations,
} = require('../../controllers/admin/languages/LanguagesController');

/* BEGIN ROUTES */
express.get('/get', getTranslations);

module.exports.LanguagesRoutes = express;
const express = require('express')();
const Auth = require('../../../services/middleware/Auth');

const {
    upload,
    remove
} = require('../../../controllers/files/FilesController');

/* BEGIN ROUTES */

express.post('/upload', Auth, upload);
express.delete('/delete', Auth, remove);

module.exports.FilesRoutes = express;
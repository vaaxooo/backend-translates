const express = require('express')();
const Admin = require('../../../services/middleware/Admin');

const {
    create: createLanguages,
    edit: editLanguages,
    remove: removeLanguages,
    getLanguagesList: getLanguages
} = require('../../../controllers/admin/languages/LanguagesController');

const {
    create: createTranslations,
    edit: editTranslations,
    remove: removeTranslations
} = require('../../../controllers/admin/languages/TranslationsController');

/* BEGIN ROUTES */


express.get('/get', Admin, getLanguages);
express.post('/add', Admin, createLanguages);
express.put('/edit', Admin, editLanguages);
express.delete('/delete', Admin, removeLanguages);

express.post('/translations/add', Admin, createTranslations);
express.put('/translations/edit', Admin, editTranslations);
express.delete('/translations/delete', Admin, removeTranslations);

module.exports.LanguagesRoutes = express;
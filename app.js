'use strict'

const express = require('express')();
const cors = require('cors');
const fileUplaod = require('express-fileupload');
const expressOasGenerator = require('express-oas-generator');

const bodyParser = require('body-parser');
const {postgres} = require('./src/utils/postgres');

/* IMPORT ROUTES */
const {CabinetRoutes} = require('./src/config/routes/cabinet/routes');
const {FilesRoutes} = require('./src/config/routes/files/routes');
const {OrdersRoutes} = require('./src/config/routes/orders/routes');
const {PricesRoutes} = require('./src/config/routes/admin/prices');
const {LanguagesRoutes} = require('./src/config/routes/admin/languages');
/* END IMPORTS */


expressOasGenerator.init(express, {
    predefinedSpec: function(spec) {
        _.set(spec, 'paths["/api/cabinet/{name}"]', 'description of a parameter');
        return spec;
    },
    specOutputPath: './swagger/test_spec.json',
        alwaysServeDocs: true,
});



express.use(bodyParser.urlencoded({extended: false}));
express.use(bodyParser.json());

express.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

express.use(fileUplaod({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: './uploads/temp'
}));

express.set('view cache', true);


/* USE ROUTES */
express.use('/api/cabinet', CabinetRoutes);
express.use('/api/files', FilesRoutes);
express.use('/api/orders', OrdersRoutes);
express.use('/api/admin/prices', PricesRoutes);
express.use('/api/admin/languages', LanguagesRoutes);
/* END ROUTES */


const PORT = process.env.PORT || 3000;
express.listen(PORT, async () => {
    await postgres.sync();
    console.log(`Server running: http://127.0.0.1:${PORT}`);
});
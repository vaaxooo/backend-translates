'use strict'

const app = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');
const {postgres} = require('./src/utils/postgres');

/* IMPORT ROUTES */
const {CabinetRoutes} = require('./src/config/routes/cabinet/routes');
const {FilesRoutes} = require('./src/config/routes/files/routes');
const {OrdersRoutes} = require('./src/config/routes/orders/routes');
const {PricesRoutes} = require('./src/config/routes/admin/prices');
const {LanguagesRoutes} = require('./src/config/routes/admin/languages');
const {TranslationsRoutes} = require('./src/config/routes/translations');
const {AdminOrdersRoutes} = require('./src/config/routes/admin/orders');
const {AdminUsersRoutes} = require('./src/config/routes/admin/users');


/* PAYMENT SYSTEMS */
const {PiastrixRoutes} = require('./src/config/routes/payments/piastrix');
const {StripeRoutes} = require('./src/config/routes/payments/stripe');

/* END IMPORTS */

const express = app();


express.use(bodyParser.urlencoded({extended: false}));
express.use(bodyParser.json());

express.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

express.use(fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: './uploads/temp'
}));

express.set('view cache', true);


/* USE ROUTES */
express.use('/api/cabinet', CabinetRoutes);
express.use('/api/files', FilesRoutes);
express.use('/api/orders', OrdersRoutes);
express.use('/api/translations', TranslationsRoutes);
express.use('/api/admin/prices', PricesRoutes);
express.use('/api/admin/languages', LanguagesRoutes);
express.use('/api/admin/orders', AdminOrdersRoutes);
express.use('/api/admin/users', AdminUsersRoutes);
express.use('/api/payments/piastrix', PiastrixRoutes);
express.use('/api/payments/stripe', StripeRoutes);
/* END ROUTES */
express.use(app.static('./uploads'));

const PORT = process.env.PORT || 3000;
express.listen(PORT, async () => {
    await postgres.sync();
    console.log(`Server running: http://127.0.0.1:${PORT}`);
});
const express = require('express')();
const Auth = require('../../../services/middleware/Auth');

const {
    login,
    register,
    recovery,
    getUserData,
    twoFactorAuth,
    checkTwoFactorCode,
    checkRecoveryCode
} = require('../../../controllers/cabinet/AuthController');

const {
    edit,
    changePassword
} = require('../../../controllers/cabinet/DataController');

/* BEGIN ROUTES */
express.post('/login', login);
express.post('/login/two-factor', twoFactorAuth);
express.post('/login/two-factor/check', checkTwoFactorCode);

express.post('/register', register);
express.post('/recovery', recovery);
express.post('/recovery/check', checkRecoveryCode);
express.get('/getUserData', Auth, getUserData);
express.put('/edit', Auth, edit);
express.put('/change-password', Auth, changePassword);

module.exports.CabinetRoutes = express;
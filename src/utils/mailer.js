const mailer = require('nodemailer');
const {apiErrorLog} = require("../utils/logger");

const config = process.env;

module.exports.mailer = mailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD
    }
});
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {SMSAPI, MessageResponse} = require('smsapi');

const {apiErrorLog} = require("../../utils/logger");
const {postgres} = require('../../utils/postgres');
const {mailer} = require('../../utils/mailer');

/* IMPORT MODELS */
const {Users} = require('../../models/Users');


module.exports = {

    /**
     * Handle login exists users
     * @param params
     * @returns {Promise<{message: string, status: number}|{data: *, status: number}>}
     */
    serviceLogin: async function ({email, password}) {
        try {
            const user = await Users.findOne({
                where: {
                    email
                }
            });
            if (user && (await bcrypt.compare(password, user.password))) {
                if(user.twofactor) {
                    return {
                        status: true,
                        twofactor: true,
                        data: {}
                    };
                }
                user.token = jwt.sign(
                    {user_id: user.id, email},
                    process.env.TOKEN_KEY || "bf5a14b224ff99991ed15223015970d5",
                    {expiresIn: "2h"}
                );
                return {
                    status: true,
                    twofactor: false,
                    data: {
                        token: user.token
                    }
                };
            }
            return {
                status: false,
                message: "Invalid credentials!"
            };
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    /**
     * Handle registration new users
     * @param params
     * @returns {Promise<any>}
     */
    serviceRegister: async function ({first_name, last_name, phone, email, password}) {
        try {
            const oldUser = await Users.findOne({
                where: {
                    email
                }
            });
            if (oldUser) {
                return {
                    status: false,
                    message: "The user already exists. Please log in!"
                };
            }
            let encryptedPassword = await bcrypt.hash(password, 10);
            const user = await Users.create({
                first_name,
                last_name,
                phone,
                email: email.toLowerCase(),
                password: encryptedPassword
            });
            user.token = jwt.sign(
                {user_id: user.id, email},
                process.env.TOKEN_KEY || "bf5a14b224ff99991ed15223015970d5",
                {expiresIn: "2h"}
            );
            return {
                status: true,
                data: {
                    token: user.token
                }
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    /**
     * Handle user password recovery
     * @param params
     * @returns {Promise<void>}
     */
    serviceRecovery: async function (email) {
        try {
            const user = Users.findOne({
                where: {
                    email: email
                }
            })
            if (!user) {
                return {
                    status: false,
                    message: "E-mail not registered"
                }
            }
            const recoveryCode = crypto.randomBytes(50).toString('hex');
            await Users.update({
                recoveryCode: recoveryCode
            }, {
                where: {
                    email: email
                }
            });
            await mailer.sendMail({
                from: process.env.SMTP_FROM_EMAIL,
                to: email,
                subject: "Recovery Password",
                text: "You have applied for password recovery from your account..",
                html: "<p>An application has been submitted to recover the password from your account. If you haven't already, just delete this message.\n\n" +
                    "Follow the link to reset your password: " + process.env.APP_DOMAIN + "/recovery/" + recoveryCode + "</p>",
            });
            return {
                status: true,
                message: "A message with password recovery has been sent to the specified E-mail."
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    /**
     * Password recovery code verification handler
     * @param email
     * @param recoveryCode
     * @returns {Promise<void>}
     */
    serviceCheckRecoveryCode: async function(recoveryCode, password) {
        try {
            const user = await Users.findOne({
                where: {
                    recoveryCode: recoveryCode
                }
            });
            if (!user) {
                return {
                    status: false,
                    message: "Invalid password recovery code"
                }
            }

            await Users.update({
                password: await bcrypt.hash(password, 10),
                recoveryCode: null
            }, {
                where: {
                    email: user.email,
                    recoveryCode: recoveryCode
                }
            });

            return {
                status: true,
                message: "Password was successfully reset"
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    /**
     * Handle get information about a user by token
     * @param user_id
     * @returns {Promise<{data: *, status: number}>}
     */
    serviceUserData: async function (user_id) {
        try {
            const user = await Users.findOne({
                attributes: ["id", "first_name", "last_name", "phone", "email", "createdAt"],
                where: {
                    id: +user_id
                }
            });
            return {
                status: true,
                data: user.dataValues
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    /**
     * Handle two-factor authentication
     * @param user_id
     * @returns {Promise<void>}
     */
    serviceTwoFactorAuth: async function (email) {
        try {
            const user = await Users.findOne({
                attributes: ["email", "twofactor", "twofactorCode"],
                where: {
                    email: email
                }
            });
            if (user.twofactor) {
                const secretCode = this.generateSecretCode;
                await Users.update({twofactorCode: secretCode}, {
                    where: {
                        email: email
                    }
                });
                const serviceSMS = new SMSAPI(process.env.SMSAPI_TOKEN);
                const response = await serviceSMS.sms.sendSms(user.phone, 'Code for two-factor authentication:' + secretCode);
                return {
                    status: true,
                    message: response.message
                }
            }
            return {
                status: false
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    /**
     * Handle checking the correctness of entering the secret code
     * @param email
     * @param secretCode
     * @returns {Promise<{data: {token: *}, status: boolean}|{message: string, status: boolean}>}
     */
    serviceCheckTwoFactorCode: async function(email, secretCode) {
        const user = await Users.findOne({
            attributes: ["email", "twofactor", "twofactorCode"],
            where: {
                email: email
            }
        });
        if(!(user)) {
            return {
                status: false,
                message: "User does not exist"
            }
        }
        if(user.twofactorCode !== secretCode) {
            return {
                status: false,
                message: "Invalid secret code"
            }
        }
        user.token = jwt.sign(
            {user_id: user.id, email},
            process.env.TOKEN_KEY || "bf5a14b224ff99991ed15223015970d5",
            {expiresIn: "2h"}
        );
        return {
            status: true,
            data: {
                token: user.token
            }
        }
    },

    /**
     * Generate secret code
     * @returns {string}
     */
    generateSecretCode: function () {
        let secretCode = '';
        let characters = '0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            secretCode += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return secretCode;
    }

}
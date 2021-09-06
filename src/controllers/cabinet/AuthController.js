const {postgres} = require('../../utils/postgres');

const {
    serviceLogin,
    serviceRegister,
    serviceRecovery,
    serviceUserData,
    serviceTwoFactorAuth,
    serviceCheckTwoFactorCode,
    serviceCheckRecoveryCode
} = require('../../services/cabinet/AuthService');

module.exports = {

    /**
     * Login exists users
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    login: async function (request, response) {
        const {email, password} = request.body;
        if (!(email && password)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceLogin({email, password}));
    },

    /**
     * Registration new users
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    register: async function (request, response) {
        const {first_name, last_name, phone, email, password} = request.body;
        if (!(first_name && last_name && phone && email && password)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceRegister({first_name, last_name, phone, email, password}));
    },

    /**
     * User password recovery
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    recovery: async function (request, response) {
        if (!(request.body.email)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceRecovery(request.body.email));
    },

    /**
     * Code recovery check
     * @param request
     * @param response
     * @returns {Promise<any>}
     */
    checkRecoveryCode: async function (request, response) {
        const {recoveryCode, password} = request.body;
        if (!(recoveryCode && password)) {
            return response.json({
                status: false,
                message: "The [recoveryCode, password] parameter is required"
            });
        }
        return response.json(await serviceCheckRecoveryCode(recoveryCode, password));
    },

    /**
     * Get information about a user by token
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    getUserData: async function (request, response) {
        return response.json(await serviceUserData(request.user.user_id))
    },

    /**
     * Two-factor authentication
     * @param request
     * @param response
     * @returns {Promise<any>}
     */
    twoFactorAuth: async function(request, response) {
        const {email} = request.body;
        if(!(email)){
            return response.json({
                status: false,
                message: "The [filename] parameter is required"
            })
        }
        return response.json(await serviceTwoFactorAuth(email));
    },

    /**
     * Checking the correctness of entering the secret code
     * @param request
     * @param response
     * @returns {Promise<any>}
     */
    checkTwoFactorCode: async function(request, response) {
        const {email, secretCode} = request.body;
        if(!(email && secretCode)){
            return response.json({
                status: false,
                message: "The [filename, secretCode] parameters is required"
            })
        }
        return response.json(await serviceCheckTwoFactorCode(email, secretCode));
    }

}
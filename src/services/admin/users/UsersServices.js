const bcrypt = require('bcryptjs');

const {apiErrorLog} = require("../../../utils/logger");
const {postgres} = require('../../../utils/postgres');
const {Users} = require('../../../models/Users');

module.exports = {

    /**
     * Admin: Create new user handler
     * @param first_name
     * @param last_name
     * @param phone
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    serviceCreate: async function (first_name, last_name, phone, email, password, admin) {
        try {
            const oldUser = await Users.findOne({
                where: {
                    email
                }
            });
            if (oldUser) {
                return {
                    status: false,
                    message: "The user already exists."
                };
            }
            let encryptedPassword = await bcrypt.hash(password, 10);
            const user = await Users.create({
                first_name,
                last_name,
                phone,
                admin,
                email: email.toLowerCase(),
                password: encryptedPassword
            });
            return {
                status: true,
                message: "User has been successfully created"
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
     * Admin: Update user data handler
     * @param user_id
     * @param first_name
     * @param last_name
     * @param phone
     * @param email
     * @param admin
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceEdit: async function (user_id, first_name, last_name, phone, email, admin) {
        try {
            await Users.update({first_name, last_name, phone, email, admin}, {
                where: {
                    id: user_id
                }
            });
            return {
                status: true,
                message: "User information successfully changed"
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
     * Admin: Change user password handler
     * @param user_id
     * @param current_password
     * @param new_password
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceChangePassword: async function (user_id, current_password, new_password) {
        try {
            const user = await Users.findOne({
                where: {
                    id: user_id
                }
            });
            if(current_password === new_password) {
                return {
                    status: false,
                    message: "The current password is the same as the new one."
                }
            }
            if (user && (await bcrypt.compare(current_password, user.password))) {
                await Users.update({password: await bcrypt.hash(new_password, 10)}, {
                    where: {
                        id: user_id
                    }
                });
                return {
                    status: true,
                    message: "Password changed successfully"
                }
            }
            return {
                status: false,
                message: "The current password is incorrect"
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
     * Admin: Remove user handler
     * @param id
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceRemove: async function (id) {
        try {
            await Users.destroy({
                where: {
                    id
                }
            });
            return {
                status: true,
                message: "User was deleted successfully!"
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
     * Admin: Get user data handler
     * @param id
     * @returns {Promise<{message: string, status: boolean}|{data: Promise<Users | null>, status: boolean}>}
     */
    serviceGetUser: async function (id) {
        try {
            const user = await Users.findOne({
                attributes: ["id", "first_name", "last_name", "phone", "email", "admin", "createdAt"],
                where: {id}
            });
            if (!user) {
                return {
                    status: false,
                    message: "User is not found"
                };
            }
            return {
                status: true,
                data: user
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
     * Admin: Get users list handler
     * @returns {Promise<{data: Promise<Users[]>, status: boolean}|{message: string, status: boolean}>}
     */
    serviceGetUsers: async function (offset = 0, limit = 10) {
        try {
            const users = await Users.findAll({
                attributes: ["id", "first_name", "last_name", "phone", "email", "admin", "createdAt"],
                offset,
                limit
            });
            return {
                status: true,
                data: users
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    }

}
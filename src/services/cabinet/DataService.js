const bcrypt = require('bcryptjs');
const {postgres} = require('../../utils/postgres');
const {Users} = require('../../models/Users');
const {apiErrorLog} = require("../../utils/logger");

module.exports = {

    /**
     * Handle editing user information
     * @param user_id
     * @param email
     * @returns {Promise<{message: string, status: number}>}
     */
    serviceEdit: async function ({user_id, first_name, last_name}) {
        try {
            await Users.update({first_name, last_name}, {
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
     * Handle change user password
     * @param user_id
     * @param current_password
     * @param new_password
     * @returns {Promise<void>}
     */
    serviceChangePassword: async function ({user_id, current_password, new_password}) {
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
    }

}
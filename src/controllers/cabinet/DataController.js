const {
    serviceEdit,
    serviceChangePassword
} = require('../../services/cabinet/DataService');

module.exports = {

    /**
     * Editing user information
     * @param request
     * @param response
     * @returns {Promise<any>}
     */
    edit: async function (request, response) {
        const {first_name, last_name} = request.body;
        const user_id = request.user.user_id;
        if(!(first_name && last_name)) {
            return response.json({
                status: 400,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceEdit({user_id, first_name, last_name}));
    },

    /**
     * Change user password
     * @param request
     * @param response
     * @returns {Promise<any>}
     */
    changePassword: async function (request, response) {
        const {current_password, new_password} = request.body;
        const user_id = request.user.user_id;
        if(!(current_password && new_password)) {
            return response.json({
                status: 400,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceChangePassword({user_id, current_password, new_password}));
    }

}
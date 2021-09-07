const {
    serviceCreate,
    serviceRemove,
    serviceEdit,
    serviceChangePassword,
    serviceGetUser,
    serviceGetUsers
} = require('../../../services/admin/users/UsersServices');

module.exports = {

    /**
     * Admin: Create new users
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    create: async function (request, response) {
        const {first_name, last_name, phone, email, password, admin} = request.body;
        if (!(first_name && last_name && phone && email && password && admin)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceCreate(first_name, last_name, phone, email, password, admin));
    },

    /**
     * Admin: Update user data
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    edit: async function(request, response) {
        const {id, first_name, last_name, phone, email, admin} = request.body;
        if(!(id && first_name && last_name && phone && email && admin)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceEdit(id, first_name, last_name, phone, email, admin));
    },

    /**
     * Admin: Change user password
     * @param request
     * @param response
     * @returns {Promise<any>}
     */
    changePassword: async function (request, response) {
        const {id, current_password, new_password} = request.body;
        if(!(current_password && new_password)) {
            return response.json({
                status: 400,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceChangePassword(id, current_password, new_password));
    },

    /**
     * Admin: Deleting a user
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    remove: async function(request, response) {
        if(!(request.body.id)){
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            })
        }
        return response.json(await serviceRemove(request.body.id));
    },

    /**
     * Admin: Get user data by id
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getUser: async function(request, response) {
        if(!(request.query.id)) {
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            });
        }
        return response.json(await serviceGetUser(+request.query.id));
    },

    /**
     * Admin: Get users list
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getUsers: async function(request, response) {
        return response.json(await serviceGetUsers(request.query?.offset || 0, request.query?.limit || 10));
    }

}
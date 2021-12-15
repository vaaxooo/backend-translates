const {
    serviceEdit,
    serviceCreate,
    serviceRemove,
    serviceGetOrder,
    serviceGetOrders
} = require('../../services/orders/OrdersService');

module.exports = {

    /**
     * Create new order
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    create: async function(request, response) {
        const {langFrom, langTo, countWords, email} = request.body;
        const user_id = request?.user?.user_id ? request?.user?.user_id : null;
        if(!(langFrom && langTo && email && countWords && request.files?.files)) {
            return response.json({
                status: false,
                message: "The [langFrom, langTo, email, countWords, files] parameters is required"
            })
        }
        return response.json(await serviceCreate(+user_id, email, langFrom, langTo, countWords, request.files.files));
    },

    /**
     * Order change processing
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    edit: async function(request, response) {
        const {id, langFrom, langTo, email} = request.body;
        const {files} = request.files;
        const user_id = request?.user?.user_id ? request?.user?.user_id : null;
        if(!(langFrom && langTo && email && files)) {
            return response.json({
                status: false,
                message: "The [id, email, langFrom, langTo, files] parameters is required"
            })
        }
        return response.json(await serviceEdit(+user_id, email, +id, langFrom, langTo, files));
    },

    /**
     * Admin: Get Order by id
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getOrder: async function(request, response) {
        const user_id = request.user.user_id
        if(!(request.query.id)) {
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            })
        }
        return response.json(await serviceGetOrder(user_id, +request.query.id));
    },

    /**
     * Admin: Get Orders list
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getOrders: async function(request, response) {
        const user_id = request?.user?.user_id;
        return response.json(await serviceGetOrders(user_id, request.query));
    },


    /**
     * Admin: Get Transactions list
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getTransactions: async function(request, response) {
        const user_id = request?.user?.user_id;
        return response.json(await serviceGetTransactions(user_id, request.query));
    }

}
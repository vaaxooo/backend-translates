const {
    serviceEdit,
    serviceRemove,
    serviceGetOrder,
    serviceGetOrders,
    serviceProcess,
    serviceStatus
} = require('../../../services/admin/orders/OrdersService');

module.exports = {

    /**
     * Admin Order change processing
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    edit: async function(request, response) {
        const {id, langFrom, langTo, in_process} = request.body;
        const {files} = request.files;
        if(!(id && in_process && langFrom && langTo && files)) {
            return response.json({
                status: false,
                message: "The [id, langFrom, langTo, in_process, files] parameters is required"
            })
        }
        return response.json(await serviceEdit(+id, langFrom, langTo, in_process, files));
    },

    /**
     * Admin Order change processing
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    remove: async function(request, response) {
        if(!(request.body.id)) {
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            })
        }
        return response.json(await serviceRemove(+request.body.id));
    },

    /**
     * Admin: Get Order by id
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getOrder: async function(request, response) {
        if(!(request.query.id)) {
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            })
        }
        return response.json(await serviceGetOrder(+request.query.id));
    },

    /**
     * Admin: Get Orders list
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getOrders: async function(request, response) {
        return response.json(await serviceGetOrders(request.query));
    },

    /**
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    setProcess: async function(request, response) {
        const {status, order_id} = request.query
        if(!(status && order_id)) {
            return response.json({
                status: false,
                message: "The [status] parameter is required"
            })
        }
        return response.json(await serviceProcess(order_id, status));
    },

    /**
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    setStatus: async function(request, response) {
        const {status, order_id} = request.query
        if(!(status && order_id)) {
            return response.json({
                status: false,
                message: "The [status] parameter is required"
            })
        }
        return response.json(await serviceStatus(order_id, status));
    }

}
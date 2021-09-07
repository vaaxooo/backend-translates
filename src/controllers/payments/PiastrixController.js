const {
    serviceCreate,
    serviceCallback
} = require('../../services/payments/PiastrixService');

module.exports = {

    /**
     * Generation payment url
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    create: async function(request, response) {
        const {order_id} = request.query;
        if(!(order_id)) {
            return response.json({
                status: false,
                message: "The [order_id] parameter is required"
            });
        }
        return response.json(await serviceCreate(order_id));
    },

    /**
     * Piastrix callback
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    callback: async function(request, response) {
        await serviceCallback(request.body);
        return response.status(200).send('OK');
    }

}
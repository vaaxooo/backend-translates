const {
    serviceCreate,
    serviceSuccess,
    serviceCancel,
    servicePoprey
} = require('../../services/payments/StripeService');

module.exports = {

    /**
     * Generation payment url
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    create: async function(request, response) {
        const {order_id, currency} = request.query;
        if(!(order_id && currency)) {
            return response.json({
                status: false,
                message: "The [order_id, currency] parameter is required"
            });
        }
        return response.json(await serviceCreate(order_id, currency));
    },

    /**
     * Stripe success
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    success: async function(request, response) {
        await serviceSuccess(request.query.session_id, request.query.order_id);
        return response.status(200).send('OK');
    },

    /**
     * Stripe cancel
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    cancel: async function(request, response) {
        await serviceCancel(request.query.session_id, request.query.order_id);
        return response.status(200).send('OK');
    },


    /**
     * Generation poprey payment url
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    poprey: async function(request, response) {
        return response.json(await servicePoprey(request.body));
    },

}
const {postgres} = require('../../../utils/postgres');

const {
    serviceCreate,
    serviceEdit,
    serviceRemove,
    serviceGetPrice,
    serviceGetPrices
} = require('../../../services/admin/prices/PricesService');

module.exports = {


    /**
     * Adding a new rate by language
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    create: async function (request, response) {
        const {language, price} = request.body;
        if (!(language && price)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceCreate(language, price));
    },

    /**
     * Changing the rate by language
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    edit: async function (request, response) {
        const {id, language, price} = request.body;
        if (!(id && language && price)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceEdit(id, language, price));
    },

    /**
     * Deleting a quote
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    remove: async function (request, response) {
        const {id} = request.body;
        if (!(id)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceRemove(id));
    },


    /**
     * Admin: Get price data by id
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getPrice: async function (request, response) {
        if (!(request.query.id)) {
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            });
        }
        return response.json(await serviceGetPrice(+request.query.id));
    },

    /**
     * Admin: Get prices list
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getPrices: async function (request, response) {
        return response.json(await serviceGetPrices(request.query?.offset || 0, request.query?.limit || 10));
    }

}
const {postgres} = require('../../../utils/postgres');
const {Prices} = require('../../../models/Prices');
const {apiErrorLog} = require("../../../utils/logger");

module.exports = {

    /**
     * Add value handler by language
     * @param language
     * @param price
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceCreate: async function (language, price) {
        try {
            await Prices.create({
                language,
                price
            });
            return {
                status: true,
                message: "New cost per language has been successfully added"
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
     * Language cost update handler
     * @param id
     * @param language
     * @param price
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceEdit: async function (id, language, price) {
        try {
            await Prices.update({
                language,
                price
            }, {
                where: {
                    id: id
                }
            });
            return {
                status: true,
                message: "Language pricing has been successfully updated"
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
     * Cost deletion handler
     * @param id
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceRemove: async function (id) {
        try {
            const data = await Prices.findOne({
                where: {
                    id: id
                }
            });
            await data.destroy();
            return {
                status: true,
                message: "Language pricing has been removed"
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
     * Admin: Get price data handler
     * @param id
     * @returns {Promise<{message: string, status: boolean}|{data: Promise<Users | null>, status: boolean}>}
     */
    serviceGetPrice: async function (id) {
        try {
            const price = await Prices.findOne({
                where: {id}
            });
            if (!price) {
                return {
                    status: false,
                    message: "Price is not found"
                };
            }
            return {
                status: true,
                data: price
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
     * Admin: Get prices list handler
     * @returns {Promise<{data: Promise<Users[]>, status: boolean}|{message: string, status: boolean}>}
     */
    serviceGetPrices: async function (offset = 0, limit = 10) {
        try {
            const PricesList = await Prices.findAll({
                offset,
                limit
            });
            return {
                status: true,
                data: PricesList
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
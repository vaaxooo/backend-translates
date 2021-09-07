const axios = require('axios');
const CryptoJS = require('crypto-js');
const {apiErrorLog} = require("../../utils/logger");

const {Orders} = require('../../models/Orders');
const {Users} = require('../../models/Users');
const {Transactions} = require('../../models/Transactions');

module.exports = {

    /**
     * Generate payment url handler
     * @param order_id
     * @returns {Promise<{}>}
     */
    serviceCreate: async function(order_id) {
        try {
            const piastrixURL = 'https://pay.piastrix.com/en/pay';
            const order = await Orders.findOne({
                where: {
                    id: order_id
                }
            });
            if(!order) {
                return {
                    status: false,
                    message: "Order not found"
                }
            }
            const user = await Users.findOne({
                where: {
                    id: order.user_id
                }
            });

            /**
             * 643 - Российский рубль
             * 840 - Доллар США
             * 978 - Евро
             * 980 - Украинская гривна
             */
/*            let result = await axios.post(piastrixURL, {
                shop_id: process.env.PIASTRIX_SHOP_ID,
                amount: order.price,
                currency: 643,
                sign: CryptoJS.SHA256(order.price + ":" + 643 + ":" + process.env.PIASTRIX_SHOP_ID + ":" + order.id + process.env.PIASTRIX_SECRET_KEY),
                shop_order_id: order.id,
                payer_account: user.email,
                callback_url: process.env.APP_DOMAIN + "/api/payments/piastrix/callback"
            });*/

            const sign = CryptoJS.SHA256(order.price + ":" + 643 + ":" + process.env.PIASTRIX_SHOP_ID + ":" + order.id + process.env.PIASTRIX_SECRET_KEY);
            let generatedUrl = piastrixURL + "?shop_id=" + process.env.PIASTRIX_SHOP_ID
                + "&amount=" + order.price + "&currency=" + 643 + "&shop_order_id=" + order.id
                + "&payer_account=" + user.email + "&sign=" + sign
                + "&callback_url=" + process.env.APP_DOMAIN + "/api/payments/piastrix/callback"

            await Transactions.create({
                email: user.email,
                payment_id: order.id,
                amount: order.price,
                status: "Waiting for payment"
            });
            return {
                status: true,
                paymentURL: generatedUrl
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
     * @param params
     * @returns {Promise<boolean>}
     */
    serviceCallback: async function(params) {
        try {
            if(params.status === "success") {
                await Orders.update({
                    paid: true
                }, {
                    where: {
                        id: params.shop_order_id
                    }
                });
            }
            await Transactions.update({
                amount: params.shop_amoint,
                status: params.status,
                currency: params.ps_currency,
                processed: params.processed
            }, {
               where: {
                   payment_id: params.shop_order_id,
                   email: params.ps_data.ps_payer_account
               }
            });
            return false;
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    }

}
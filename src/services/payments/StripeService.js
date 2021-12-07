const {apiErrorLog} = require("../../utils/logger");

const {Orders} = require('../../models/Orders');
const {Transactions} = require('../../models/Transactions');

const Stripe = require('stripe');
const stripe = Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

module.exports = {

    /**
     * Generate payment url handler
     * @param order_id
     * @param currency
     * @returns {Promise<{paymentURL: string, status: boolean}|{message: string, status: boolean}>}
     */
    serviceCreate: async function(order_id, currency) {
        try {
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
            const price = (order.price * 100);
            if(price < 50) {
                return {
                    status: false,
                    message: "The Checkout Session's total amount due must add up to at least 0.50 " + currency
                }
            }
            const invoice = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: currency,
                            product_data: {
                                name: 'Payment for text translation',
                            },
                            unit_amount: price,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `https://reseron.com/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
                cancel_url: `https://reseron.com/payment-error?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`
            });
            await Transactions.create({
                email: order.email,
                payment_id: order.id,
                amount: order.price,
                status: "Waiting for payment"
            });
            return {
                status: true,
                invoice
            }
        } catch (error) {
            console.log(error);
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },


    /**
     *
     * @param session_id
     * @param order_id
     * @returns {Promise<boolean>}
     */
    serviceSuccess: async function(session_id, order_id) {
        try {
            const invoice = await stripe.checkout.sessions.retrieve(session_id);
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
            if(invoice.payment_status === "paid") {
                await Orders.update({
                    paid: true
                }, {
                    where: {
                        id: order_id
                    }
                });
            }
            await Transactions.update({
                status: invoice.payment_status,
                currency: invoice.currency
            }, {
                where: {
                    payment_id: order_id,
                    email: order.email
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
    },


    /**
     *
     * @param session_id
     * @param order_id
     * @returns {Promise<boolean>}
     */
    serviceCancel: async function(session_id, order_id) {
        try {
            const invoice = await stripe.checkout.sessions.retrieve(session_id);
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

            await Transactions.update({
                status: invoice.payment_status,
            }, {
                where: {
                    payment_id: order_id,
                    email: order.email
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
    },

}
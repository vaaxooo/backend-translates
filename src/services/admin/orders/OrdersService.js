const {mailer} = require('../../../utils/mailer');

const {apiErrorLog} = require("../../../utils/logger");
const {Orders} = require("../../../models/Orders");
const {Users} = require("../../../models/Users");
const {
    serviceUploadOneFile,
    serviceRemove
} = require("../../files/FilesService");

module.exports = {

    /**
     * Order change handle
     * @param id
     * @param langFrom
     * @param langTo
     * @param in_process
     * @param files
     * @returns {Promise<{totalPrice: number, files: [], message: string, status: boolean}|{message: string, status: boolean}>}
     */
    serviceEdit: async function (id, langFrom, langTo, in_process, files) {
        try {
            const order = await Orders.findOne({
                where: {
                    id
                }
            });
            if(!order) {
                return {
                    status: false,
                    message: "Order not found"
                }
            }
            let params = {langForm: langFrom, langTo: langTo}
            let filesArray = [];
            if(Array.isArray(files)){
                for await(const file of files) {
                    let result = await serviceUploadOneFile(file);
                    filesArray.push(result.data);
                }
            } else {
                let result = await serviceUploadOneFile(files);
                filesArray.push(result.data);
            }

            order.files.push(filesArray);
            await Orders.update({
                langFrom, langTo,
                in_process,
                files: order.files
            }, {
                where: {
                    id: id
                }
            });
            return {
                status: true,
                message: "The order has been successfully updated!"
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    serviceRemove: async function (id) {
        try {
            const order = await Orders.findOne({
                where: {
                    id
                }
            });
            if(!order) {
                return {
                    status: false,
                    message: "Order not found"
                }
            }
            for await (const data of order.files) {
                await serviceRemove(id, data.file);
            }
            await order.destroy();
            return {
                status: true,
                message: "Order successfully deleted"
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
     * @param id
     * @returns {Promise<void>}
     */
    serviceGetOrder: async function(id) {
        try {
            const order = await Orders.findOne({
                where: {id}
            });
            if (!order) {
                return {
                    status: false,
                    message: "Order is not found"
                };
            }
            return {
                status: true,
                data: order
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
     * @returns {Promise<void>}
     */
    serviceGetOrders: async function(params) {
        try {
            let sort = [];
            params?.langFrom ? sort.push(['langForm', params.langFrom]) : null;
            params?.langTo ? sort.push(['langTo', params.langTo]) : null;
            params?.price ? sort.push(['price', params.price]) : null;
            params?.in_process ? sort.push(['in_process', params.in_process]) : null;
            const orders = await Orders.findAll({
                order: sort,
                offset: params?.offset || 0,
                limit: params?.limit || 10
            });
            return {
                status: true,
                data: orders
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
     * @param order_id
     * @param status
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceProcess: async function(order_id, status) {
        try {
            await Orders.update({in_process: status}, {
                where: {
                    id: order_id
                }
            });
            return {
                status: true,
                message: "Status has been successfully changed!"
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
     * @param order_id
     * @param status
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceStatus: async function(order_id, status) {
        try {
            const order = await Orders.update({status: status}, {
                where: {
                    id: order_id
                }
            });
            const user = await Users.findOne({
                where: {
                    email: order.user_id
                }
            });
            await mailer.sendMail({
                from: process.env.SMTP_FROM_EMAIL,
                to: user.email,
                subject: "Text translation order completed",
                text: "Text translation order completed..",
                html: "<p>Your order for text translation has been completed. You can download the file with the translation in your personal account.</p>",
            });
            return {
                status: true,
                message: "Status has been successfully changed!"
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
const {apiErrorLog} = require("../../../utils/logger");
const {Orders} = require("../../../models/Orders");
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
    }
}
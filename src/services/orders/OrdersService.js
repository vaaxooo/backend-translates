const {apiErrorLog} = require("../../utils/logger");
const {Orders} = require("../../models/Orders");
const {
    serviceUploadOneFile,
    serviceRemove
} = require("../files/FilesService");

module.exports = {

    /**
     * New order creation handler
     * @param user_id
     * @param email
     * @param langFrom
     * @param langTo
     * @param files
     * @returns {Promise<{totalPrice: number, files: *, message: string, status: boolean}>}
     */
    serviceCreate: async function(user_id, email, langFrom, langTo, files) {
        try {
            let filesArray = [];
            if(Array.isArray(files)) {
                for await(const file of files) {
                    let result = await serviceUploadOneFile(file);
                    filesArray.push(result.data);
                }
            } else {
                let result = await serviceUploadOneFile(files);
                filesArray.push(result.data);
            }
            let totalPrice = 0;
            filesArray.filter(item => totalPrice = (+totalPrice + +item.price).toFixed(2));
            await Orders.create({
                user_id,
                email,
                langFrom,
                langTo,
                price: totalPrice,
                files: filesArray
            });
            return {
                status: true,
                totalPrice: totalPrice,
                files: filesArray,
                message: "The order has been successfully created!"
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
     * Order change handle
     * @param user_id
     * @param email
     * @param id
     * @param langFrom
     * @param langTo
     * @param files
     * @returns {Promise<{totalPrice: number, files: [], message: string, status: boolean}|{message: string, status: boolean}>}
     */
    serviceEdit: async function (user_id, email, id, langFrom, langTo, files) {
        try {
            const order = await Orders.findOne({
                where: {
                    id, email
                }
            });
            if(!order) {
                return {
                    status: false,
                    message: "Order not found"
                }
            }

            let params = {langForm: langFrom, langTo: langTo, email: email}
            let filesArray = [];
            let totalPrice = 0;

            if(order.in_process === false) {
                for await (const data of order.files) {
                    await serviceRemove(user_id, data.file);
                }
                if(Array.isArray(files)){
                    for await(const file of files) {
                        let result = await serviceUploadOneFile(file);
                        filesArray.push(result.data);
                    }
                } else {
                    let result = await serviceUploadOneFile(files);
                    filesArray.push(result.data);
                }
                filesArray.filter(item => totalPrice = (+totalPrice + +item.price).toFixed(2));
                params = Object.assign({}, params, {
                    price: totalPrice,
                    files: filesArray
                });
            } else {
                totalPrice = order.price;
            }
            await Orders.update(params, {
                where: {
                    id: id,
                    user_id: user_id
                }
            });
            return {
                status: true,
                totalPrice: totalPrice,
                files: filesArray.length > 0 ? filesArray : order.files,
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


    /**
     * @param user_id
     * @param id
     * @returns {Promise<void>}
     */
    serviceGetOrder: async function(user_id, id) {
        try {
            const order = await Orders.findOne({
                where: {
                    id,
                    user_id
                }
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
    serviceGetOrders: async function(user_id, params = {}, offset = 0, limit = 10) {
        try {
            let sort = [];
            params?.langFrom ? sort.push(['langForm', params.langFrom]) : null;
            params?.langTo ? sort.push(['langTo', params.langTo]) : null;
            params?.price ? sort.push(['price', params.price]) : null;
            params?.in_process ? sort.push(['in_process', params.in_process]) : null;
            const orders = await Orders.findAll({
                where: {
                    user_id
                },
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
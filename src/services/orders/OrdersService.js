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
     * @param langFrom
     * @param langTo
     * @param files
     * @returns {Promise<{totalPrice: number, files: *, message: string, status: boolean}>}
     */
    serviceCreate: async function(user_id, langFrom, langTo, files) {
        try {
            let filesArray = [];
            for await(const file of files) {
                let result = await serviceUploadOneFile(file);
                filesArray.push(result.data);
            }
            let totalPrice = 0;
            filesArray.filter(item => totalPrice = item.price);
            await Orders.create({
                user_id,
                langFrom,
                langTo,
                price: totalPrice,
                files: filesArray
            });
            return {
                status: true,
                totalPrice: totalPrice,
                files: files,
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
     * @param id
     * @param langFrom
     * @param langTo
     * @param files
     * @returns {Promise<{totalPrice: number, files: [], message: string, status: boolean}|{message: string, status: boolean}>}
     */
    serviceEdit: async function (user_id, id, langFrom, langTo, files) {
        try {
            const order = await Orders.findOne({
                where: {
                    id, user_id
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
                files: filesArray || order.files,
                message: "The order has been successfully updated!"
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
const {
    serviceEdit,
    serviceCreate,
    serviceRemove
} = require('../../services/orders/OrdersService');

module.exports = {
    /**
     * Order change processing
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    edit: async function(request, response) {
        const {id, langFrom, langTo} = request.body;
        const {files} = request.files;
        const user_id = request.user.user_id;
        if(!(langFrom && langTo && files)) {
            return response.json({
                status: false,
                message: "The [id, langFrom, langTo, files] parameters is required"
            })
        }
        return response.json(await serviceEdit(+user_id, +id, langFrom, langTo, files));
    }

}
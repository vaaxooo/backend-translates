const {
    serviceUpload,
    serviceRemove
} = require('../../services/files/FilesService');

module.exports = {

    /**
     * Upload files
     * @param request
     * @param response
     * @returns {Promise<any>}
     */
    upload: async function (request, response) {
        const files = request.files;
        const user_id = request.user.user_id;

        if (!(files)) {
            return response.json({
                status: false,
                message: "All fields are required!"
            });
        }
        return response.json(await serviceUpload(user_id, files));
    },

    /**
     * Delete file
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    remove: async function (request, response) {
        const {filename} = request.body;
        const user_id = request.user;
        if(!filename) {
            return response.json({
                status: 400,
                message: "The [filename] parameter is required"
            })
        }
        return response.json(await serviceRemove(user_id, filename));
    }

}
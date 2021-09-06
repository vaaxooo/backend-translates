const {
    serviceEdit,
    serviceCreate,
    serviceRemove
} = require('../../../services/admin/languages/TranslationsService');

module.exports = {

    /**
     * Add new translation for language
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    create: async function(request, response) {
        const {language, key, translate} = request.body;
        if(!(language && key && translate)) {
            return response.json({
                status: false,
                message: "The [language, key, translate] parameters is required"
            })
        }
        return response.json(await serviceCreate(language, key, translate));
    },

    /**
     * Edit translation
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    edit: async function(request, response) {
        const {language, key, translate} = request.body;
        if(!(language && key && translate)) {
            return response.json({
                status: false,
                message: "The [id, code, key, language] parameters is required"
            });
        }
        return response.json(await serviceEdit(language, key, translate));
    },

    /**
     * Remove translation
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    remove: async function(request, response) {
        const {language, key} = request.body;
        if(!(language && key)) {
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            });
        }
        return response.json(await serviceRemove(language, key));
    }

}
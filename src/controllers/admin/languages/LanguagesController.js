const {
    serviceEdit,
    serviceCreate,
    serviceRemove,
    serviceGet,
    serviceGetTranslations
} = require('../../../services/admin/languages/LanguagesService');

module.exports = {

    /**
     * Add new language
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    create: async function(request, response) {
        const {code, name} = request.body;
        if(!(code && name)) {
            return response.json({
                status: false,
                message: "The [code, name] parameters is required"
            })
        }
        return response.json(await serviceCreate(code, name));
    },

    /**
     * Edit language
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    edit: async function(request, response) {
        const {id, code, name} = request.body;
        if(!(id && code && name)) {
            return response.json({
                status: false,
                message: "The [id, code, name] parameters is required"
            });
        }
        return response.json(await serviceEdit(id, code, name));
    },

    /**
     * Remove language
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    remove: async function(request, response) {
        if(!request.body.id) {
            return response.json({
                status: false,
                message: "The [id] parameter is required"
            });
        }
        return response.json(await serviceRemove(request.body.id));
    },

    /**
     * Get All Languages
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getLanguagesList: async function(request, response) {
        return response.json(await serviceGet());
    },

    /**
     * Get translations by language
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    getTranslations: async function(request, response) {
        const language = request.user.lang || "en";
        return response.json(await serviceGetTranslations(language));
    }

}
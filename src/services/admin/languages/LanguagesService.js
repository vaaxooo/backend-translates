const fs = require('fs');
const {postgres} = require('../../../utils/postgres');
const {Languages} = require('../../../models/Languages');
const {apiErrorLog} = require("../../../utils/logger");

module.exports = {

    /**
     * Add new language handler
     * @param code
     * @param name
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceCreate: async function (code, name) {
        try {
            await Languages.create({
                code,
                name
            });
            if(!fs.existsSync("src/config/languages/" + code + ".json")) {
                fs.copyFileSync("src/config/languages/en.json", "src/config/languages/" + code + ".json");
            }
            return {
                status: true,
                message: "New language has been successfully added"
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
     * Language update handler
     * @param id
     * @param code
     * @param name
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceEdit: async function (id, code, name) {
        try {
            await Languages.update({
                code,
                name
            }, {
                where: {
                    id: id
                }
            });
            return {
                status: true,
                message: "Language has been successfully updated"
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
     * Language deletion handler
     * @param id
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceRemove: async function (id) {
        try {
            const data = await Languages.findOne({
                where: {
                    id: id
                }
            });
            if(fs.existsSync("src/config/languages/" + data.code + ".json")) {
                fs.unlinkSync("src/config/languages/" + data.code + ".json");
            }
            await data.destroy();
            return {
                status: true,
                message: "Language has been removed"
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
     * Handle get all languages
     * @returns {Promise<{message: string, status: boolean}|{data: Languages[], status: boolean}>}
     */
    serviceGet: async function(offset = 0, limit = 10) {
        try {
            const languages = await Languages.findAll({
                attributes: ["id", "code", "name"],
                offset,
                limit
            });
            return {
                status: true,
                data: languages
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
     * Get translations by language handler
     * @param language
     * @returns {Promise<{data: Buffer, status: boolean}|{message: string, status: boolean}>}
     */
    serviceGetTranslations: async function(language) {
        try {
            let configContent = fs.readFileSync('src/config/languages/' + language + '.json');
            let translations = JSON.parse(configContent);
            return {
                status: true,
                data: translations
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
     * @returns {Promise<{data: Languages, status: boolean}|{message: string, status: boolean}>}
     */
    serviceGetData: async function(id) {
        try {
            const language = await Languages.findOne();
            return {
                status: true,
                data: language
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
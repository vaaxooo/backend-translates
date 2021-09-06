const fs = require('fs');
const {apiErrorLog} = require('../../../utils/logger');

module.exports = {

    /**
     * Add new translation for language handler
     * @param language
     * @param key
     * @param translate
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceCreate: async function (language, key, translate) {
        try {
            let configContent = fs.readFileSync('src/config/languages/' + language + '.json');
            let config = JSON.parse(configContent);
            if(!config.hasOwnProperty([key])){
                config = Object.assign({}, config, {[key]: translate});
                let configJSON = JSON.stringify(config);
                fs.writeFileSync('src/config/languages/' + language + '.json', configJSON);
                return {
                    status: true,
                    message: "Translate has been successfully added"
                }
            }
            return {
                status: false,
                message: "This translation already exists"
            }
        } catch (error) {
            console.log(error)
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

    /**
     * Translate update handler
     * @param id
     * @param language
     * @param key
     * @param translate
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceEdit: async function (language, key, translate) {
        try {
            let path = 'src/config/languages/' + language + '.json';
            let configContent = fs.readFileSync(path);
            let config = JSON.parse(configContent);
            if(config.hasOwnProperty([key])){
                config[key] = translate;
                let configJSON = JSON.stringify(config);
                fs.writeFileSync('src/config/languages/' + language + '.json', configJSON);
                return {
                    status: true,
                    message: "Translate has been successfully updated"
                }
            }
            return {
                status: false,
                message: "This translate not exists"
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
     * Translate deletion handler
     * @param language
     * @param key
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceRemove: async function (language, key) {
        try {
            let path = 'src/config/languages/' + language + '.json';
            let configContent = fs.readFileSync(path);
            let config = JSON.parse(configContent);
            if(config.hasOwnProperty([key])){
                delete config[key];
                let configJSON = JSON.stringify(config);
                fs.writeFileSync('src/config/languages/' + language + '.json', configJSON);
                return {
                    status: true,
                    message: "Translate has been removed"
                }
            }
            return {
                status: false,
                message: "This translate not exists exists"
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
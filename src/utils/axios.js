'use strict'

const {apiErrorLog} = require('./logger');

const axios = require('axios').create({
    baseURL: 'https://domain.com/',
    headers: {
        'Accept-Language': 'ru,uk-UA;q=0.9,uk;q=0.8,en-US;q=0.7,en;q=0.6',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36'
    }
});

module.exports = {

    /**
     * Sending a request to a specific URL
     * @param url
     * @param data
     * @param method
     * @param responseType
     * @returns {Promise<T>}
     */
    sendRequest: function (url = "", data = {}, method = "GET", responseType = "json") {
        return axios({url, method, data, responseType})
            .then(({data}) => {
                if (!data) {
                    throw new Error(`Incorrect result (failed request)`);
                }
                return data;
            })
            .catch(error => {
                apiErrorLog(error);
            });
    }

}
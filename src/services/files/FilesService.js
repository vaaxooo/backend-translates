const bcryptjs = require('bcryptjs');
const fs = require('fs');
const {apiErrorLog} = require("../../utils/logger");
const pdf = require('pdf-parse');

module.exports = {

    /**
     * File upload handler
     * @param user_id
     * @param files
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceUpload: async function (user_id, files) {
        try {
            const allowedFormats = [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //doc
                "application/msword", //docx
                "text/plain", //txt
                "application/pdf" //pdf
            ];
            for (const key in files) {
                let file = files[key];
                if (allowedFormats.includes(file.mimetype) === false) {
                    return {
                        status: false,
                        message: 'Allowed file upload in the following format: [doc, docx, txt, pdf]'
                    };
                }
                let fileName = await bcryptjs.hash(new Date() + file.name.split('.')[0], Math.ceil(Math.random() * (10 - 5 + 1) + 5));
                fileName = fileName.replace(/[^a-zа-яё0-9\s]/gi, "") + "." + file.name.split('.')[1];
                await file.mv("uploads/files/" + fileName);
                fs.stat("uploads/files/" + fileName, function (error, stats) {
                    //TO DO (DATABASE INSERT FileName)
                });
            }
            return {
                status: true,
                message: "All files uploaded successfully"
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
     * File deletion handler
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceRemove: async function (user_id, fileName) {
        try {
                //Check User permission in database (Orders - filename)
                if(fs.existsSync("uploads/files/" + fileName)){
                    fs.unlinkSync("uploads/files/" + fileName);
                }
                //TO DO (DATABASE Update)
            return {
                status: true,
                message: "File was deleted successfully"
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
     * File upload handler
     * @param file
     * @returns {Promise<{message: string, status: boolean}>}
     */
    serviceUploadOneFile: async function (file, price) {
        try {
            const allowedFormats = [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //doc
                "application/msword", //docx
                "text/plain", //txt
                "application/pdf" //pdf
            ];
            if (allowedFormats.includes(file.mimetype) === false) {
                return {
                    status: false,
                    message: 'Allowed file upload in the following format: [doc, docx, txt, pdf]'
                };
            }
            let fileName = await bcryptjs.hash(new Date() + file.name.split('.')[0], Math.ceil(Math.random() * (10 - 5 + 1) + 5));
            fileName = fileName.replace(/[^a-zа-яё0-9\s]/gi, "") + "." + file.name.split('.')[1];
            await file.mv("uploads/files/" + fileName);

            let data = {
                price: (fs.readFileSync("uploads/files/" + fileName).toString().split(' ').length * price).toFixed(2), //0.30 - cents
                file: fileName
            }

            console.log(data)
            return

            if(file.mimetype === "application/pdf") {
                let dataBuffer = fs.readFileSync("uploads/files/" + fileName);
                let pdfContent = await pdf(dataBuffer);
                data = Object.assign({}, data, {content: pdfContent.text})
            }

            return {
                status: true,
                data: data,
            }
        } catch (error) {
            apiErrorLog(error);
            return {
                status: false,
                message: "Oops.. Something went wrong"
            }
        }
    },

}
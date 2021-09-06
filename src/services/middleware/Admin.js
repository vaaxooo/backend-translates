const jwt = require("jsonwebtoken");
const {postgres} = require("../../utils/postgres");
const {Users} = require("../../models/Users");
const config = process.env;

const verifyToken = async (request, response, next) => {
    const token = request.body.token || request.query.token || request.headers['authorization'];
    if(!token) {
        return response.json({
            status: false,
            message: "The token is required for authorization!"
        });
    }
    try {
        request.user = jwt.verify(token, config.TOKEN_KEY || "bf5a14b224ff99991ed15223015970d5");
        const user = await Users.findOne({
            where: {
                id: +request.user.user_id
            }
        });
        if(!(user && user.admin)) {
            return response.json({
                status: false,
                message: "You do not have sufficient rights to complete the request."
            });
        }
    } catch (error) {
        return response.json({
            status: false,
            message: "Invalid token!"
        });
    }
    return next();
}

module.exports = verifyToken;
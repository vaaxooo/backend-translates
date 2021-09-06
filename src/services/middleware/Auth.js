const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (request, response, next) => {
    const token = request.body.token || request.query.token || request.headers['authorization'];
    if(!token) {
        return response.json({
            status: false,
            message: "The token is required for authorization!"
        });
    }
    try {
        request.user = jwt.verify(token, config.TOKEN_KEY || "bf5a14b224ff99991ed15223015970d5");
        request.user.lang = request.body.language || "en";
    } catch (error) {
        return response.json({
            status: false,
            message: "Invalid token!"
        });
    }
    return next();
}

module.exports = verifyToken;
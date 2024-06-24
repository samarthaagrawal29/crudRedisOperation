const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const jwtAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader == null || authHeader == undefined) {
        logger.warn(`UnAuthorized Access Occured!!`)
        return res.status(401).json({
            status: 401,
            message: "UnAuthorized",
        });
    }

    const token = authHeader.split(" ")[1];
    //* verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            logger.warn(`UnAuthorized Access Occured!!`)
            return res.status(401).json({
                status: 401,
                message: "UnAuthorized",
            });
        }

        logger.info(`User Verified Successfully!!`)
        req.user = payload;
        next();
    });
};

module.exports = {
    jwtAuth
}

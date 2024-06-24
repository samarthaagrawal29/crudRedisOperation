const logger = require("../config/logger");
const { User } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email
        });
        if (user) {
            logger.warn(`Invalid credentials`);
            if (!bcrypt.compareSync(password, user.password)) {
                lo
                return res.status(401).json({
                    message: "Invalid credentials",
                });
            }

            const payload = {
                name: user.name,
                email: user.email,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "365d",
            });

            logger.info(`Login Successfully`);
            return res.status(200).json({
                message: "Login Successfully",
                access_token: `Bearer ${token}`,
            });
        }
        logger.info(`Invalid credentials`);
        return res.status(401).json({
            message: "Invalid credentials",
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).send(`Somthing wents wrong!!`);
    }
};

module.exports = {
    login
}
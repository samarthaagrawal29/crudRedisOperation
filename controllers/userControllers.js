const { User } = require('../models');
const logger = require('../config/logger');
const bcrypt = require('bcrypt');
const { redisSet } = require('../helpers');
const { Redis } = require('ioredis');
const redisClient = new Redis();

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;
        //Checking if data Already Exist or not
        const checkUser = await User.findOne({
            phoneNumber: phoneNumber,
            $or: [{ email: email }]
        });
        if (checkUser) {
            return res.status(401).json({ message: "User already exists" });
        }
        const salt = bcrypt.genSaltSync(10);
        logger.info(`User Body is Verified`);
        const user = new User({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: bcrypt.hashSync(password, salt)
        });
        logger.info(`Password Salted Successfully!!`);
        const saveUser = await user.save();
        await redisSet(saveUser);
        res.status(201).json(saveUser);

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`ID Not Found!!`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const update = {
            firstName: req.body?.firstName,
            lastName: req.body?.lastName,
            phoneNumber: req.body?.phoneNumber,
            email: req.body?.email,
            password: req.body?.password
        };
        console.log(update, id);
        const result = await User.findByIdAndUpdate(id, update);
        if (result) {
            logger.info(`Details Updated Successfully!!`)
            res.status(200).send(`Details Updated Successfully!!`)
        } else {
            logger.error(`Something Went Wrong, Deatils Not Updated!!`);
            res.status(500).send(`Something Went Wrong, Deatils Not Updated!!`);
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`ID Not Found!!`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const result = await User.findByIdAndDelete(id);
        if (result) {
            const redisKey = `${id}`;
            await redisClient.del(redisKey);
            logger.info(`Cache Deleted Successfully!!`)
            logger.info(`User Deleted Successfully!!`)
            res.status(200).send(`User Deleted Successfully!!`)
        } else {
            logger.error(`Something Went Wrong, User Not Deleted!!`);
            res.status(500).send(`Something Went Wrong, User Not Deleted!!`);
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllUser = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {

        const totalCount = await User.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const users = await User.find({})
            .skip((page - 1) * limit)
            .limit(limit);

        if (users.length > 0) {
            logger.info(`Data Fetch Successfully!!`);
            res.status(200).json({
                users,
                currentPage: page,
                totalPages,
                totalUsers: totalCount
            });
        } else {
            return res.status(404).json({ message: 'No users found' });
        }

    } catch (error) {
        logger.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const getUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            logger.warn(`ID Not found!!`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const user = await User.findById(id);
        if (user) {
            logger.info(`User Details Found Successfully !!`);
            res.status(200).json(user);
        } else {
            logger.info(`User Details Not Found!!`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createUser,
    updateUserDetails,
    deleteUser,
    getAllUser,
    getUserByID
}
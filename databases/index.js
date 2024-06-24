const mongoose = require('mongoose');
const logger = require('../config/logger');
const connectMongoose = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.qlfz9ef.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        logger.info(`MongoDB Connected!!`);
    } catch (error) {
        logger.error(error.message);
    }
}

module.exports.connectMongoose = connectMongoose;
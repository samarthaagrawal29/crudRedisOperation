require('dotenv').config()
const redis = require('redis');
console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);
const redisClient = redis.createClient({
    host: 'redis-stack',
    port: 6379
});
const logger = require('../config/logger')

const redisSet = async (data) => {
    try {
        redisClient.set(`${data._id}`, JSON.stringify(data), "EX", 3600); // Cache data for 1 hour
        logger.info('New user created and cached in Redis');
    } catch (error) {
        logger.error(error.message);
    }
}

module.exports = {
    redisSet
}
const logger = require('../config/logger');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.error('Validation error: ', error.details[0].message);
      res.status(400).json({ error: error.details[0].message });
    } else {
      next();
    }
  };
};

module.exports = {
    validate
}

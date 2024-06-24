const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  phoneNumber: Joi.number().integer().min(1000000000).max(9999999999).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  userSchema
};

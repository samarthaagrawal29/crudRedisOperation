const Joi = require('joi');

const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(30),
  lastName: Joi.string().min(2).max(30),
  phoneNumber: Joi.number().integer().min(1000000000).max(9999999999),
  email: Joi.string().email(),
  password: Joi.string()
});

module.exports = {
  updateUserSchema
};
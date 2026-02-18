import Joi from 'joi';

export const leadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  course: Joi.string().required(),
  college: Joi.string().required(),
  year: Joi.string().required()
});

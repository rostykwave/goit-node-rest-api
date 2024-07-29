import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Pass the value 'name' into the body",
  }),
  email: Joi.string().required().messages({
    "any.required": "Pass the value 'email' into the body",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Pass the value 'phone' into the body",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

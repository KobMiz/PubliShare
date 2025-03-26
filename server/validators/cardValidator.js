const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required and cannot be empty.",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required and cannot be empty.",
  }),
  nickname: Joi.string().required().max(50).messages({
    "string.empty": "Nickname is required and cannot be empty.",
    "string.max": "Nickname cannot exceed 50 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required and cannot be empty.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.empty": "Password is required and cannot be empty.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "string.empty": "Phone number is required and cannot be empty.",
    }),
  country: Joi.string().required().max(50).messages({
    "string.empty": "Country is required and cannot be empty.",
    "string.max": "Country name cannot exceed 50 characters.",
  }),
  birthdate: Joi.date().iso().required().messages({
    "date.base": "Birthdate must be a valid date.",
    "date.format": "Birthdate must be in ISO format (YYYY-MM-DD).",
    "any.required": "Birthdate is required.",
  }),
  image: Joi.string().allow(""),
  isAdmin: Joi.boolean().optional(),
}).custom((value, helpers) => {
  if (value.image && value.profileImage) {
    return helpers.message(
      "יש לבחור רק תמונה אחת – או קובץ מהמחשב או כתובת מהאינטרנט."
    );
  }
  return value;
});

module.exports = { userSchema };

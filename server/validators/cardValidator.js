const Joi = require("joi");

// Card schema
const cardSchema = Joi.object({
  text: Joi.string().max(500).required().messages({
    "string.max": "Text cannot exceed 500 characters.",
    "string.empty": "Text is required and cannot be empty.",
  }),
  image: Joi.object({
    url: Joi.string().uri().allow("").messages({
      "string.uri": "Image URL must be a valid URI.",
    }),
    alt: Joi.string().allow("").messages({
      "string.base": "Alt text must be a string.",
    }),
  }).optional(),
  video: Joi.string().uri().allow("").messages({
    "string.uri": "Video must be a valid URI.",
  }),
  link: Joi.string().uri().allow("").messages({
    "string.uri": "Link must be a valid URI.",
  }),
});

// Comment schema
const commentSchema = Joi.object({
  text: Joi.string().max(300).required().messages({
    "string.max": "Comment cannot exceed 300 characters.",
    "string.empty": "Comment text is required and cannot be empty.",
  }),
});

module.exports = { cardSchema, commentSchema };

import Joi from "joi";

export const getOrderSchema = Joi.object({
  page: Joi.number().integer().positive().optional().default(1).messages({
    "number.base": "Page must be a valid number.",
    "number.integer": "Page must be an integer.",
    "number.positive": "Page must be a positive number.",
  }),
  limit: Joi.number().integer().positive().optional().default(3).messages({
    "number.base": "Limit must be a valid number.",
    "number.integer": "Limit must be an integer.",
    "number.positive": "Limit must be a positive number.",
  }),
});

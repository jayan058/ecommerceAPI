import Joi from "joi";

export const createUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a string.",
    "string.empty": "Username cannot be empty.",
    "string.min": "Username should have at least 3 characters.",
    "string.max": "Username should not exceed 30 characters.",
    "any.required": "Username is required.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),

  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password should have at least 6 characters.",
    "any.required": "Password is required.",
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password should be at least 6 characters long.",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
});

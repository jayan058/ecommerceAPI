import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Product ID must be a valid number.',
      'number.integer': 'Product ID must be an integer.',
      'number.positive': 'Product ID must be a positive number.',
      'any.required': 'Product ID is required.'
    }),

  quantity: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Quantity must be a valid number.',
      'number.integer': 'Quantity must be an integer.',
      'number.positive': 'Quantity must be greater than zero.',
      'any.required': 'Quantity is required.'
    }),
});

export const updateCartSchema = Joi.object({
    quantity: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        'number.base': 'Quantity must be a valid number.',
        'number.integer': 'Quantity must be an integer.',
        'number.min': 'Quantity cannot be negative. Use zero (0) to remove the item from the cart.',
        'any.required': 'Quantity is required.'
      })
  });

 
export const deleteCartItemSchema = Joi.object({
    productId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Cart item ID must be a valid number.',
        'number.integer': 'Cart item ID must be an integer.',
        'number.positive': 'Cart item ID must be a positive number.',
        'any.required': 'Cart item ID is required for deletion.'
      })
  });
  
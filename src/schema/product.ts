import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Product name must be a string.",
    "string.empty": "Product name cannot be empty.",
    "string.min": "Product name must have at least 3 characters.",
    "string.max": "Product name cannot exceed 100 characters.",
    "any.required": "Product name is required.",
  }),

  brand: Joi.string().min(3).max(50).required().messages({
    "string.base": "Brand name must be a string.",
    "string.empty": "Brand name cannot be empty.",
    "string.min": "Brand name must have at least 3 characters.",
    "string.max": "Brand name cannot exceed 50 characters.",
    "any.required": "Brand name is required.",
  }),

  category: Joi.string().min(3).max(50).required().messages({
    "string.base": "Category must be a string.",
    "string.empty": "Category cannot be empty.",
    "string.min": "Category must have at least 3 characters.",
    "string.max": "Category cannot exceed 50 characters.",
    "any.required": "Category is required.",
  }),

  price: Joi.number().greater(0).required().messages({
    "number.base": "Price must be a number.",
    "number.greater": "Price must be greater than 0.",
    "any.required": "Price is required.",
  }),

  inventory_count: Joi.number().integer().min(0).required().messages({
    "number.base": "Inventory count must be a number.",
    "number.integer": "Inventory count must be an integer.",
    "number.min": "Inventory count cannot be negative.",
    "any.required": "Inventory count is required.",
  }),

  description: Joi.string().max(500).optional().messages({
    "string.base": "Description must be a string.",
    "string.max": "Description cannot exceed 500 characters.",
  }),

  created_at: Joi.date().optional().default(Date.now).messages({
    "date.base": "Created date must be a valid date.",
  }),
});

export const updatePriceSchema = Joi.object({
  newPrice: Joi.number().greater(0).required().messages({
    "number.base": "New price must be a number.",
    "number.greater": "New price must be greater than 0.",
    "any.required": "New price is required.",
  }),
});
export const updatePriceQuerySchema = Joi.object({
productId: Joi.number().integer().positive().required().messages({
  "number.base": "Product id must be a valid number.",
  "number.integer": "Product id must be an integer.",
  "number.positive": "Product id must be a positive number.",
}),
})


export const updateStockSchema = Joi.object({
  newStock: Joi.number().integer().min(0).required().messages({
    "number.base": "New stock count must be a number.",
    "number.integer": "New stock count must be an integer.",
    "number.min": "New stock count cannot be negative.",
    "any.required": "New stock count is required.",
  }),
});

export const productQuerySchema = Joi.object({
  category: Joi.string().optional().messages({
    "string.base": "Category must be a valid string.",
  }),
  brand: Joi.string().optional().messages({
    "string.base": "Brand must be a valid string.",
  }),
  priceRange: Joi.string()
    .optional()
    .pattern(/^\d+(\.\d+)?,\d+(\.\d+)?$/)
    .messages({
      "string.base": "Price range must be a valid string.",
      "string.pattern.base":
        "Price range must be in the format 'minPrice,maxPrice' with non-negative numbers.",
    }),
  name: Joi.string().optional().messages({
    "string.base": "Name must be a valid string.",
  }),
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

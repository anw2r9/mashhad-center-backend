const Joi = require('joi');

exports.createProductSchema = Joi.object({
    name: Joi.string().min(2).max(200).trim().required().messages({
        'any.required': 'Product name is required'
    }),
    description: Joi.string().min(10).max(2000).required().messages({
        'any.required': 'Product description is required'
    }),
    price: Joi.number().positive().precision(2).required().messages({
        'any.required': 'Price is required'
    }),
    category: Joi.string().valid('electronics', 'clothing', 'food', 'books', 'other').required().messages({
        'any.only': 'Invalid category',
        'any.required': 'Category is required'
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'any.required': 'Stock is required'
    }),
    images: Joi.array().items(Joi.string()).default([])
});

exports.updateProductSchema = Joi.object({
    name: Joi.string().min(2).max(200).trim(),
    description: Joi.string().min(10).max(2000),
    price: Joi.number().positive().precision(2),
    category: Joi.string().valid('electronics', 'clothing', 'food', 'books', 'other'),
    stock: Joi.number().integer().min(0),
    images: Joi.array().items(Joi.string()),
    isActive: Joi.boolean()
});

exports.ratingSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'any.required': 'Rating is required',
        'number.min': 'Rating must be between 1 and 5'
    }),
    comment: Joi.string().trim().max(500)
});
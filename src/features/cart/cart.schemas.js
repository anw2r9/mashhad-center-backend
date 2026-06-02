const Joi = require('joi');

exports.addToCartSchema = Joi.object({
    productId: Joi.string().length(24).hex().required().messages({
        'any.required': 'Product is required'
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        'any.required': 'Quantity is required'
    })
});

exports.updateCartSchema = Joi.object({
    quantity: Joi.number().integer().min(1).required()
});

exports.syncCartSchema = Joi.object({
    items: Joi.array().items(Joi.object({
        productId: Joi.string().length(24).hex().required(),
        quantity: Joi.number().integer().min(1).required()
    })).required()
});
const Joi = require('joi');

exports.createOrderSchema = Joi.object({
    items: Joi.array().items(Joi.object({
        productId: Joi.string().length(24).hex().required(),
        quantity: Joi.number().integer().min(1).required()
    })).min(1).required().messages({
        'any.required': 'Items are required',
        'array.min': 'At least one product is required'
    }),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('credit', 'paypal', 'simulated').required().messages({
        'any.required': 'Payment method is required'
    }),
    notes: Joi.string().max(500)
});

exports.updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')
        .required(),
    trackingNumber: Joi.string().allow('')
});
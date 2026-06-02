const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required().messages({
        'string.min': 'Name must be at least 2 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email({ tlds: false }).lowercase().required().messages({
        'string.email': 'Invalid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
        .required().messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain uppercase, lowercase and a number',
            'any.required': 'Password is required'
        })
});

exports.loginSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).lowercase().required().messages({
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

exports.forgotPasswordSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).lowercase().required()
});

exports.resetPasswordSchema = Joi.object({
    password: Joi.string().min(6).max(128).required()
});

exports.verify2faSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).lowercase().required(),
    code: Joi.string().length(6).required()
});
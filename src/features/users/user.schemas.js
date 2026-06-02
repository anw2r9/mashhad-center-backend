const Joi = require('joi');

exports.updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    email: Joi.string().email({ tlds: false }).lowercase()
});

exports.changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'كلمة المرور الحالية مطلوبة'
    }),
    newPassword: Joi.string().min(8).max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
        .required().messages({
            'string.min': 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم',
            'any.required': 'كلمة المرور الجديدة مطلوبة'
        })
});

exports.addressSchema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required()
});
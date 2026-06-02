const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authenticate = require('../../shared/middleware/authenticate');
const validate = require('../../shared/middleware/validate');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verify2faSchema
} = require('./auth.schemas');

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.get('/reset-password/:token', authController.resetPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

// Admin routes (2FA)
router.post('/admin/login', validate(loginSchema), authController.adminLogin);
router.post('/admin/verify-2fa', validate(verify2faSchema), authController.verify2FA);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
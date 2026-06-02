const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const validate = require('../../shared/middleware/validate');
const { updateProfileSchema, changePasswordSchema, addressSchema } = require('./user.schemas');

// Customer routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);
router.post('/addresses', authenticate, validate(addressSchema), userController.addAddress);
router.put('/addresses/:addrId', authenticate, validate(addressSchema), userController.updateAddress);
router.delete('/addresses/:addrId', authenticate, userController.deleteAddress);

// Admin routes
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.put('/:id/role', authenticate, authorize('admin'), userController.updateUserRole);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const validate = require('../../shared/middleware/validate');
const { createOrderSchema, updateOrderStatusSchema } = require('./order.schemas');

// مسارات المستخدم المسجل
router.post('/', authenticate, validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

// مسارات المدير فقط
router.get('/', authenticate, authorize('admin'), orderController.getAllOrders);
router.put('/:id/status', authenticate, authorize('admin'), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const authenticate = require('../../shared/middleware/authenticate');
const validate = require('../../shared/middleware/validate');
const { addToCartSchema, updateCartSchema, syncCartSchema } = require('./cart.schemas');

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, validate(addToCartSchema), cartController.addToCart);
router.put('/:productId', authenticate, validate(updateCartSchema), cartController.updateCartItem);
router.delete('/:productId', authenticate, cartController.removeFromCart);
router.delete('/', authenticate, cartController.clearCart);
router.post('/sync', authenticate, validate(syncCartSchema), cartController.syncCart);

module.exports = router;
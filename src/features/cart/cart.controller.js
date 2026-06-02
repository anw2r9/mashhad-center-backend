const cartService = require('./cart.service');

// 1. Get cart
exports.getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user._id);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

// 2. Add to cart
exports.addToCart = async (req, res, next) => {
    try {
        const cart = await cartService.addToCart(req.user._id, req.body);
        res.status(200).json({ success: true, message: 'Product added to cart', data: cart });
    } catch (error) {
        next(error);
    }
};

// 3. Update cart item
exports.updateCartItem = async (req, res, next) => {
    try {
        const cart = await cartService.updateCartItem(req.user._id, req.params.productId, req.body.quantity);
        res.status(200).json({ success: true, message: 'Quantity updated', data: cart });
    } catch (error) {
        next(error);
    }
};

// 4. Remove from cart
exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
        res.status(200).json({ success: true, message: 'Product removed from cart', data: cart });
    } catch (error) {
        next(error);
    }
};

// 5. Clear cart
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await cartService.clearCart(req.user._id);
        res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
    } catch (error) {
        next(error);
    }
};

// 6. Sync cart
exports.syncCart = async (req, res, next) => {
    try {
        const cart = await cartService.syncCart(req.user._id, req.body);
        res.status(200).json({ success: true, message: 'Cart synced', data: cart });
    } catch (error) {
        next(error);
    }
};
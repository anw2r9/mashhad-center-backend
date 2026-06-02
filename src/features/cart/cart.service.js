const User = require('../users/user.model');
const Product = require('../products/product.model');

// 1. Get cart
exports.getCart = async (userId) => {
    const user = await User.findById(userId).populate('cart.product', 'name price images isActive');
    return user.cart;
};

// 2. Add to cart
exports.addToCart = async (userId, { productId, quantity }) => {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (product.stock < quantity) {
        const error = new Error('Requested quantity not available');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(userId);
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        user.cart.push({ product: productId, quantity });
    }

    await user.save();
    return user.cart;
};

// 3. Update cart item
exports.updateCartItem = async (userId, productId, quantity) => {
    const user = await User.findById(userId);
    const item = user.cart.find(item => item.product.toString() === productId);

    if (!item) {
        const error = new Error('Product not found in cart');
        error.statusCode = 404;
        throw error;
    }

    item.quantity = quantity;
    await user.save();
    return user.cart;
};

// 4. Remove from cart
exports.removeFromCart = async (userId, productId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { cart: { product: productId } } },
        { new: true }
    );
    return user.cart;
};

// 5. Clear cart
exports.clearCart = async (userId) => {
    await User.findByIdAndUpdate(userId, { cart: [] });
    return [];
};

// 6. Sync cart
exports.syncCart = async (userId, { items }) => {
    const user = await User.findById(userId);

    for (const item of items) {
        const existing = user.cart.find(c => c.product.toString() === item.productId);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            user.cart.push({ product: item.productId, quantity: item.quantity });
        }
    }

    // Check stock
    for (const cartItem of user.cart) {
        const product = await Product.findById(cartItem.product);
        if (product && cartItem.quantity > product.stock) {
            cartItem.quantity = product.stock;
        }
    }

    await user.save();
    return user.cart;
};
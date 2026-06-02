const orderService = require('./order.service');

// 1. Create order
exports.createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.user._id, req.body, req.app.get('io'));
        res.status(201).json({ success: true, message: 'Order created successfully', data: order });
    } catch (error) {
        next(error);
    }
};

// 2. Get my orders
exports.getMyOrders = async (req, res, next) => {
    try {
        const result = await orderService.getMyOrders(req.user._id, req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// 3. Get order by id
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// 4. Get all orders (admin)
exports.getAllOrders = async (req, res, next) => {
    try {
        const result = await orderService.getAllOrders(req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// 5. Update order status (admin)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(req.params.id, req.body, req.app.get('io'));
        res.status(200).json({ success: true, message: 'Order status updated', data: order });
    } catch (error) {
        next(error);
    }
};

// 6. Cancel order
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await orderService.cancelOrder(req.params.id, req.user._id);
        res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
    } catch (error) {
        next(error);
    }
};
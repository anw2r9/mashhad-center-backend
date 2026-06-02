const Order = require('./order.model');
const Product = require('../products/product.model');
const User = require('../users/user.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// 1. Create order
exports.createOrder = async (userId, orderData, io) => {
    const { items, shippingAddress, paymentMethod, notes } = orderData;

    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== items.length) {
        const error = new Error('Some products were not found');
        error.statusCode = 400;
        throw error;
    }

    let totalPrice = 0;
    const orderItems = items.map(item => {
        const product = products.find(p => p._id.toString() === item.productId);

        if (product.stock < item.quantity) {
            const error = new Error(`Insufficient stock for product: ${product.name}`);
            error.statusCode = 400;
            throw error;
        }

        totalPrice += product.price * item.quantity;

        return {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.images[0] || ''
        };
    });

    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        totalPrice,
        paymentMethod,
        notes
    });

    const bulkOps = items.map(item => ({
        updateOne: {
            filter: { _id: item.productId },
            update: {
                $inc: {
                    stock: -item.quantity,
                    sold: item.quantity
                }
            }
        }
    }));
    await Product.bulkWrite(bulkOps);

    await User.findByIdAndUpdate(userId, { cart: [] });

    const user = await User.findById(userId);
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Order Confirmation',
        html: `
            <h2>Thank you for your order ${user.name}!</h2>
            <p>Order ID: <strong>${order._id}</strong></p>
            <p>Total: <strong>${totalPrice}</strong></p>
            <p>Payment Method: <strong>${paymentMethod}</strong></p>
            <h3>Products:</h3>
            <ul>
                ${orderItems.map(i => `<li>${i.name} × ${i.quantity} = ${i.price * i.quantity}</li>`).join('')}
            </ul>
        `
    }).catch(() => {});

    if (io) {
        io.emit('order-created', { orderId: order._id, totalPrice });
    }

    for (const item of items) {
        const product = products.find(p => p._id.toString() === item.productId);
        const newStock = product.stock - item.quantity;
        if (io) {
            io.to(item.productId).emit('stock-updated', {
                productId: item.productId,
                stock: newStock
            });
            if (newStock === 0) {
                io.to(item.productId).emit('product-out-of-stock', { productId: item.productId });
            }
        }
    }

    return order;
};

// 2. Get my orders
exports.getMyOrders = async (userId, query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Order.countDocuments({ user: userId })
    ]);

    return {
        orders,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total
    };
};

// 3. Get order by id
exports.getOrderById = async (orderId, userId, role) => {
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    if (role !== 'admin' && order.user._id.toString() !== userId.toString()) {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
    }

    return order;
};

// 4. Get all orders (admin)
exports.getAllOrders = async (query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Order.countDocuments()
    ]);

    return {
        orders,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total
    };
};

// 5. Update order status (admin) — ✅ FIXED
exports.updateOrderStatus = async (orderId, updateData, io) => {
    // CRM يرسل { status } — نحوّله لـ orderStatus
    const update = {};
    if (updateData.status) update.orderStatus = updateData.status;
    if (updateData.trackingNumber) update.trackingNumber = updateData.trackingNumber;

    const order = await Order.findByIdAndUpdate(orderId, update, { new: true });
    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    // إرسال إيميل تحديث الحالة
    const user = await User.findById(order.user);
    if (user) {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Order Status Update',
            html: `
                <h2>Order Update</h2>
                <p>Order ID: <strong>${order._id}</strong></p>
                <p>New Status: <strong>${order.orderStatus}</strong></p>
                ${order.trackingNumber ? `<p>Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
            `
        }).catch(() => {});
    }

    // Socket.io realtime update
    if (io) {
        io.emit('order-updated', { orderId: order._id, status: order.orderStatus });
    }

    return order;
};

// 6. Cancel order
exports.cancelOrder = async (orderId, userId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    if (order.user.toString() !== userId.toString()) {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
    }

    if (order.orderStatus !== 'pending') {
        const error = new Error('Cannot cancel order after processing');
        error.statusCode = 400;
        throw error;
    }

    order.orderStatus = 'cancelled';
    await order.save();

    const bulkOps = order.items.map(item => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { stock: item.quantity, sold: -item.quantity } }
        }
    }));
    await Product.bulkWrite(bulkOps);

    return order;
};
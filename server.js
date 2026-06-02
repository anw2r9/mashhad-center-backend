require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const corsOptions = require('./src/config/cors.config');
const errorHandler = require('./src/shared/middleware/errorHandler');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    socket.on('join-product', (productId) => socket.join(productId));
    socket.on('leave-product', (productId) => socket.leave(productId));
    socket.on('disconnect', () => console.log('❌ Client disconnected:', socket.id));
});

app.set('io', io);

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
}));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Rate limiters
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many attempts, try again in a minute' }
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, try again later' }
});

// Routes
app.use('/api/v1/auth', authLimiter, require('./src/features/auth/auth.router'));
app.use('/api/v1/products', apiLimiter, require('./src/features/products/product.router'));
app.use('/api/v1/orders', apiLimiter, require('./src/features/orders/order.router'));
app.use('/api/v1/users', apiLimiter, require('./src/features/users/user.router'));
app.use('/api/v1/cart', apiLimiter, require('./src/features/cart/cart.router'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
});
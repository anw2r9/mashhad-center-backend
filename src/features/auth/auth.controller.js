const authService = require('./auth.service');

// 1. Register
exports.register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Account created successfully, please check your email',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// 2. Login
exports.login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// 3. Verify email
exports.verifyEmail = async (req, res, next) => {
    try {
        const result = await authService.verifyEmail(req.params.token);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

// 4. Forgot password
exports.forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body.email);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

// 5. Reset password
exports.resetPassword = async (req, res, next) => {
    try {
        if (req.method === 'GET') {
            return res.status(200).json({
                success: true,
                message: 'Token is valid, send your new password'
            });
        }
        const result = await authService.resetPassword(req.params.token, req.body.password);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

// 6. Admin login (step 1)
exports.adminLogin = async (req, res, next) => {
    try {
        const result = await authService.adminLogin(req.body);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

// 7. Verify 2FA
exports.verify2FA = async (req, res, next) => {
    try {
        const result = await authService.verify2FA(req.body);
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// 8. Get current user
exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};
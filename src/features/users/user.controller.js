const userService = require('./user.service');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user._id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user._id, req.body);
        res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const result = await userService.changePassword(req.user._id, req.body);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

exports.addAddress = async (req, res, next) => {
    try {
        const addresses = await userService.addAddress(req.user._id, req.body);
        res.status(201).json({ success: true, message: 'Address added successfully', data: addresses });
    } catch (error) {
        next(error);
    }
};

exports.updateAddress = async (req, res, next) => {
    try {
        const addresses = await userService.updateAddress(req.user._id, req.params.addrId, req.body);
        res.status(200).json({ success: true, message: 'Address updated successfully', data: addresses });
    } catch (error) {
        next(error);
    }
};

exports.deleteAddress = async (req, res, next) => {
    try {
        const addresses = await userService.deleteAddress(req.user._id, req.params.addrId);
        res.status(200).json({ success: true, message: 'Address deleted successfully', data: addresses });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers(req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const user = await userService.updateUserRole(req.params.id, req.body.role);
        res.status(200).json({ success: true, message: 'Role updated successfully', data: user });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};
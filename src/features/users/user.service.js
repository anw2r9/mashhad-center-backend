const User = require('./user.model');

// 1. Get profile
exports.getProfile = async (userId) => {
    const user = await User.findById(userId.toString());
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

// 2. Update profile
exports.updateProfile = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true
    });
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

// 3. Change password
exports.changePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        const error = new Error('Current password is incorrect');
        error.statusCode = 401;
        throw error;
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
};

// 4. Add address
exports.addAddress = async (userId, addressData) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $push: { addresses: addressData } },
        { new: true }
    );
    return user.addresses;
};

// 5. Update address
exports.updateAddress = async (userId, addressId, addressData) => {
    const user = await User.findOneAndUpdate(
        { _id: userId, 'addresses._id': addressId },
        { $set: { 'addresses.$': { ...addressData, _id: addressId } } },
        { new: true }
    );
    if (!user) {
        const error = new Error('Address not found');
        error.statusCode = 404;
        throw error;
    }
    return user.addresses;
};

// 6. Delete address
exports.deleteAddress = async (userId, addressId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
    );
    return user.addresses;
};

// 7. Get all users (admin)
exports.getAllUsers = async (query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find().select('-password').skip(skip).limit(Number(limit)).lean(),
        User.countDocuments()
    ]);

    return {
        users,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total
    };
};

// 8. Update user role (admin)
exports.updateUserRole = async (userId, role) => {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

// 9. Delete user (admin)
exports.deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return { message: 'User deleted successfully' };
};
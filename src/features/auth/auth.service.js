const crypto = require('crypto');
const User = require('../users/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// إنشاء التوكن
const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// إعداد الإيميل
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// 1. تسجيل مستخدم جديد
exports.registerUser = async (userData) => {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
        const error = new Error('البريد الإلكتروني مسجل مسبقاً');
        error.statusCode = 409;
        throw error;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
        ...userData,
        verificationToken,
        verificationTokenExpiry
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'تحقق من حسابك',
        html: `
            <h2>مرحباً ${user.name}</h2>
            <p>اضغط على الرابط للتحقق من حسابك:</p>
            <a href="http://localhost:5000/api/v1/auth/verify-email/${verificationToken}">
                تحقق من الحساب
            </a>
            <p>الرابط صالح لمدة 24 ساعة</p>
        `
    });

    const token = signToken(user._id, user.role);
    user.password = undefined;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    return { user, token };
};

// 2. تسجيل الدخول
exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        const error = new Error('بيانات الدخول غير صحيحة');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error('بيانات الدخول غير صحيحة');
        error.statusCode = 401;
        throw error;
    }

    // Email verification disabled for development
    // if (!user.isVerified) {
    //     const error = new Error('يرجى تأكيد بريدك الإلكتروني أولاً');
    //     error.statusCode = 403;
    //     throw error;
    // }

    const token = signToken(user._id, user.role);
    user.password = undefined;

    return { user, token };
};

// 3. التحقق من الإيميل
exports.verifyEmail = async (token) => {
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        const error = new Error('رابط التحقق غير صالح أو منتهي الصلاحية');
        error.statusCode = 400;
        throw error;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return { message: 'تم تأكيد الحساب بنجاح' };
};

// 4. نسيت كلمة المرور
exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('البريد الإلكتروني غير موجود');
        error.statusCode = 404;
        throw error;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'إعادة تعيين كلمة المرور',
        html: `
            <h2>إعادة تعيين كلمة المرور</h2>
            <p>اضغط على الرابط لإعادة تعيين كلمة المرور:</p>
            <a href="http://localhost:3000/reset-password/${resetToken}" style="background:#f59e0b;color:#111;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;display:inline-block;">
                إعادة تعيين كلمة المرور
            </a>
            <p>الرابط صالح لمدة ساعة واحدة</p>
        `
    });

    return { message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني' };
};

// 5. إعادة تعيين كلمة المرور
exports.resetPassword = async (token, password) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        const error = new Error('رابط إعادة التعيين غير صالح أو منتهي الصلاحية');
        error.statusCode = 400;
        throw error;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return { message: 'تم إعادة تعيين كلمة المرور بنجاح' };
};

// 6. تسجيل دخول المدير (الخطوة 1 - 2FA)
exports.adminLogin = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== 'admin') {
        const error = new Error('بيانات الدخول غير صحيحة');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error('بيانات الدخول غير صحيحة');
        error.statusCode = 401;
        throw error;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorCode = code;
    user.twoFactorExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'كود التحقق الثنائي',
        html: `
            <h2>كود التحقق الثنائي</h2>
            <p>كودك هو: <strong>${code}</strong></p>
            <p>صالح لمدة 10 دقائق</p>
        `
    });

    return { message: 'تم إرسال كود التحقق إلى بريدك الإلكتروني' };
};

// 7. التحقق من كود 2FA
exports.verify2FA = async ({ email, code }) => {
    const user = await User.findOne({
        email,
        twoFactorCode: code,
        twoFactorExpiry: { $gt: Date.now() }
    });

    if (!user) {
        const error = new Error('الكود غير صحيح أو منتهي الصلاحية');
        error.statusCode = 400;
        throw error;
    }

    user.twoFactorCode = undefined;
    user.twoFactorExpiry = undefined;
    await user.save();

    const token = signToken(user._id, user.role);
    return { user, token };
};
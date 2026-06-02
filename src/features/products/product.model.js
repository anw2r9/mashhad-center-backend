const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
    description: { type: String, required: true, minlength: 10, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        required: true,
        enum: ['cement', 'steel', 'blocks', 'sand', 'gravel', 'tools', 'paint', 'plumbing']
    },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sold: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    ratings: { type: [ratingSchema], default: [] },
    averageRating: { type: Number, default: 0, max: 5 }
}, { timestamps: true });

// إنشاء indexes للبحث السريع
productSchema.index({ category: 1 });
productSchema.index({ name: 1 });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
const Product = require('./product.model');

// 1. Get all products with pagination and filtering
exports.getAllProducts = async (query) => {
    const { page = 1, limit = 20, category, minPrice, maxPrice, sort } = query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortObj = {};
    if (sort === 'price_asc') sortObj.price = 1;
    else if (sort === 'price_desc') sortObj.price = -1;
    else if (sort === 'rating') sortObj.averageRating = -1;
    else sortObj.createdAt = -1;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find(filter)
            .select('name price images averageRating category stock')
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Product.countDocuments(filter)
    ]);

    return {
        products,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total
    };
};

// 2. Get product by id
exports.getProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product || !product.isActive) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }
    return product;
};

// 3. Get products by category
exports.getProductsByCategory = async (category, query) => {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find({ category, isActive: true })
            .select('name price images averageRating stock')
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Product.countDocuments({ category, isActive: true })
    ]);

    return {
        products,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total
    };
};

// 4. Create product
exports.createProduct = async (productData) => {
    const product = await Product.create(productData);
    return product;
};

// 5. Update product
exports.updateProduct = async (id, updateData) => {
    const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }
    return product;
};

// 6. Delete product (soft delete)
exports.deleteProduct = async (id) => {
    const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }
    return { message: 'Product deleted successfully' };
};

// 7. Add rating
exports.addRating = async (productId, userId, ratingData) => {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    const existingRating = product.ratings.find(r => r.user.toString() === userId.toString());
    if (existingRating) {
        existingRating.rating = ratingData.rating;
        existingRating.comment = ratingData.comment;
    } else {
        product.ratings.push({ user: userId, ...ratingData });
    }

    const total = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = (total / product.ratings.length).toFixed(1);

    await product.save();
    return product;
};

exports.getSimilarProducts = async (productId, category) => {
    const products = await Product.find({
        _id: { $ne: productId },
        category,
        isActive: true
    })
    .select('name price images averageRating stock category')
    .limit(4)
    .lean();
    return products;
};
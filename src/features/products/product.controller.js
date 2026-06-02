const productService = require('./product.service');

// 1. Get all products
exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// 2. Get product by id
exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// 3. Get products by category
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const result = await productService.getProductsByCategory(req.params.category, req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// 4. Create product
exports.createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        req.app.get('io').emit('product-created', product);
        res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (error) {
        next(error);
    }
};

// 5. Update product
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error) {
        next(error);
    }
};

// 6. Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

// 7. Add rating
exports.addRating = async (req, res, next) => {
    try {
        const product = await productService.addRating(req.params.id, req.user._id, req.body);
        res.status(200).json({ success: true, message: 'Rating added successfully', data: product });
    } catch (error) {
        next(error);
    }
};

// 8. Get similar products
exports.getSimilarProducts = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        const similar = await productService.getSimilarProducts(req.params.id, product.category);
        res.status(200).json({ success: true, data: similar });
    } catch (error) {
        next(error);
    }
};
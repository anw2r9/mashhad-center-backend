    const express = require('express');
    const router = express.Router();
    const productController = require('./product.controller');
    const authenticate = require('../../shared/middleware/authenticate');
    const authorize = require('../../shared/middleware/authorize');
    const validate = require('../../shared/middleware/validate');
    const { createProductSchema, updateProductSchema, ratingSchema } = require('./product.schemas');
    const { upload } = require('../../config/cloudinary');
    const Product = require('./product.model');

    // Public routes
    router.get('/', productController.getAllProducts);
    router.get('/cat/:category', productController.getProductsByCategory);
    router.get('/:id', productController.getProductById);
    router.get('/:id/similar', productController.getSimilarProducts);

    // Admin routes
    router.post('/', authenticate, authorize('admin'), validate(createProductSchema), productController.createProduct);
    router.put('/:id', authenticate, authorize('admin'), validate(updateProductSchema), productController.updateProduct);
    router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

    // رفع صورة للمنتج
    router.post('/:id/upload-image', authenticate, authorize('admin'), upload.single('image'), async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $push: { images: req.file.path } },
        { new: true }
        );
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
    });

    // Rating
    router.post('/:id/rating', authenticate, validate(ratingSchema), productController.addRating);

    module.exports = router;
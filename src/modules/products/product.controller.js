const productService = require("./product.service");

// Get all products
const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

// Get product by ID
const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// Create product
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// Update product
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// Delete product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product,
        });
    } catch (error) {
        next(error);
    }
};


// Create product size
const createProductSize = async (req, res, next) => {
    try {
        const size = await productService.createProductSize({
            productId: req.params.productId,
            ...req.body,
        });

        res.status(201).json({
            success: true,
            message: "Product size created successfully",
            data: size,
        });
    } catch (error) {
        next(error);
    }
};

// Get product sizes
const getProductSizes = async (req, res, next) => {
    try {
        const sizes = await productService.getProductSizes(
            req.params.productId
        );

        res.status(200).json({
            success: true,
            data: sizes,
        });
    } catch (error) {
        next(error);
    }
};


// Add ingredient to product size
const createProductSizeIngredient = async (req, res, next) => {
    try {
        const ingredient =
            await productService.createProductSizeIngredient({
                productSizeId: req.params.sizeId,
                ...req.body,
            });

        res.status(201).json({
            success: true,
            message: "Ingredient added successfully",
            data: ingredient,
        });
    } catch (error) {
        next(error);
    }
};






module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductSize,
    getProductSizes,
    createProductSizeIngredient,
};
const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
  requirePagePermission,
} = require("../../middlewares/permission.middleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductSize,
  getProductSizes,
  createProductSizeIngredient,
} = require("./product.controller");

const router = express.Router();

// Get all products
router.get("/", authMiddleware, requirePagePermission("products"), getProducts);

// Get product by ID
router.get(
  "/:id",
  authMiddleware,
  requirePagePermission("products"),
  getProductById,
);

// Create product
router.post(
  "/",
  authMiddleware,
  requirePagePermission("products"),
  createProduct,
);

// Get product sizes
router.get(
  "/:productId/sizes",
  authMiddleware,
  requirePagePermission("products"),
  getProductSizes,
);

// Create product size
router.post(
  "/:productId/sizes",
  authMiddleware,
  requirePagePermission("products"),
  createProductSize,
);

// Add ingredient to product size
router.post(
    "/:productId/sizes/:sizeId/ingredients",
    authMiddleware,
    requirePagePermission("products"),
    createProductSizeIngredient
);


// Update product
router.put(
  "/:id",
  authMiddleware,
  requirePagePermission("products"),
  updateProduct,
);

// Delete product
router.delete(
  "/:id",
  authMiddleware,
  requirePagePermission("products"),
  deleteProduct,
);

module.exports = router;

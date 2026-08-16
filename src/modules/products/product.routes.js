const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
  requirePagePermission,
} = require("../../middlewares/permission.middleware");

const {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductSize,
  getProductSizes,
  createProductSizeIngredient,
  getProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
  addProductTypeIngredient,
  removeProductTypeIngredient,
  getAddons,
  createAddon,
  updateAddon,
  deleteAddon,
} = require("./product.controller");

const router = express.Router();

// Get all products
router.get("/", authMiddleware, requirePagePermission("products"), getProducts);

// Get product by barcode (POS scan) — MUST be before "/:id"
router.get(
  "/by-barcode/:code",
  authMiddleware,
  requirePagePermission("products"),
  getProductByBarcode,
);

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

// Get product types
router.get(
    "/:productId/types",
    authMiddleware,
    requirePagePermission("products"),
    getProductTypes,
);

// Create product type
router.post(
    "/:productId/types",
    authMiddleware,
    requirePagePermission("products"),
    createProductType,
);

// Update product type
router.put(
    "/:productId/types/:typeId",
    authMiddleware,
    requirePagePermission("products"),
    updateProductType,
);

// Delete product type
router.delete(
    "/:productId/types/:typeId",
    authMiddleware,
    requirePagePermission("products"),
    deleteProductType,
);

// Add ingredient to product type
router.post(
    "/:productId/types/:typeId/ingredients/:rawMaterialId",
    authMiddleware,
    requirePagePermission("products"),
    addProductTypeIngredient,
);

// Remove ingredient from product type
router.delete(
    "/:productId/types/:typeId/ingredients/:rawMaterialId",
    authMiddleware,
    requirePagePermission("products"),
    removeProductTypeIngredient,
);

// Get addons for a product
router.get(
    "/:productId/addons",
    authMiddleware,
    requirePagePermission("products"),
    getAddons,
);

// Create addon
router.post(
    "/:productId/addons",
    authMiddleware,
    requirePagePermission("products"),
    createAddon,
);

// Update addon
router.put(
    "/:productId/addons/:addonId",
    authMiddleware,
    requirePagePermission("products"),
    updateAddon,
);

// Delete addon
router.delete(
    "/:productId/addons/:addonId",
    authMiddleware,
    requirePagePermission("products"),
    deleteAddon,
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

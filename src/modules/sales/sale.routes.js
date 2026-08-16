const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    validateSale,
} = require("./sale.validation");

const {
    getSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
} = require("./sale.controller");

const router = express.Router();

// ============================================================
// Get all sales
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission("sales"),
    requireActionPermission("sales", "view_sales_history"),
    getSales
);

// ============================================================
// Get sale by ID
// ============================================================

router.get(
    "/:id",
    authMiddleware,
    requirePagePermission("sales"),
    requireActionPermission("sales", "view_sales_history"),
    getSaleById
);

// ============================================================
// Create sale
// ============================================================

router.post(
    "/",
    authMiddleware,
    requirePagePermission("sales"),
    requireActionPermission("sales", "create_invoice"),
    validateSale,
    createSale
);

// ============================================================
// Update sale
// ============================================================

router.put(
    "/:id",
    authMiddleware,
    requirePagePermission("sales"),
    requireActionPermission("sales", "edit_invoice"),
    validateSale,
    updateSale
);

// ============================================================
// Delete sale
// ============================================================

router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission("sales"),
    requireActionPermission("sales", "cancel_invoice"),
    deleteSale
);

module.exports = router;

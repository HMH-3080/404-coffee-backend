const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
} = require("../../middlewares/permission.middleware");

const {
    getPurchases,
    getPurchaseById,
    createPurchase,
    updatePurchase,
    approvePurchase,
    cancelPurchase,
    deletePurchase,
} = require("./purchase.controller");

const router = express.Router();

// Get all purchases
router.get(
    "/",
    authMiddleware,
    requirePagePermission("purchases"),
    getPurchases
);

// Get purchase by ID
router.get(
    "/:id",
    authMiddleware,
    requirePagePermission("purchases"),
    getPurchaseById
);

// Create purchase
router.post(
    "/",
    authMiddleware,
    requirePagePermission("purchases"),
    createPurchase
);

// Update purchase
router.put(
    "/:id",
    authMiddleware,
    requirePagePermission("purchases"),
    updatePurchase
);

// Approve purchase
router.patch(
    "/:id/approve",
    authMiddleware,
    requirePagePermission("purchases"),
    approvePurchase
);

// Cancel purchase
router.patch(
    "/:id/cancel",
    authMiddleware,
    requirePagePermission("purchases"),
    cancelPurchase
);

// Delete purchase
router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission("purchases"),
    deletePurchase
);

module.exports = router;

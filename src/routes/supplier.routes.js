const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");

const {
    requirePagePermission,
} = require("../middlewares/permission.middleware");

const {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/supplier.controller");

const router = express.Router();


// Get all suppliers
router.get(
    "/",
    authMiddleware,
    requirePagePermission("suppliers"),
    getSuppliers,
);


// Get supplier by ID
router.get(
    "/:id",
    authMiddleware,
    requirePagePermission("suppliers"),
    getSupplierById,
);


// Create supplier
router.post(
    "/",
    authMiddleware,
    requirePagePermission("suppliers"),
    createSupplier,
);


// Update supplier
router.put(
    "/:id",
    authMiddleware,
    requirePagePermission("suppliers"),
    updateSupplier,
);


// Delete supplier
router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission("suppliers"),
    deleteSupplier,
);


module.exports = router;
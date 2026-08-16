const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
} = require("../../middlewares/permission.middleware");

const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require("./customer.controller");

const {
    validateCustomer,
} = require("./customer.validation");

const router = express.Router();

// ============================================================
// Get all customers
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission("customers"),
    getCustomers
);

// ============================================================
// Get customer by ID
// ============================================================

router.get(
    "/:id",
    authMiddleware,
    requirePagePermission("customers"),
    getCustomerById
);

// ============================================================
// Create customer
// ============================================================

router.post(
    "/",
    authMiddleware,
    requirePagePermission("customers"),
    validateCustomer,
    createCustomer
);

// ============================================================
// Update customer
// ============================================================

router.put(
    "/:id",
    authMiddleware,
    requirePagePermission("customers"),
    updateCustomer
);

// ============================================================
// Delete customer
// ============================================================

router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission("customers"),
    deleteCustomer
);

module.exports = router;
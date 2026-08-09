const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../middlewares/permission.middleware");

const {
    testSalesAccess,
    testCreateInvoiceAccess,
} = require("../controllers/test.controller");

const router = express.Router();


// Test page permission
router.get(
    "/sales",
    authMiddleware,
    requirePagePermission("sales"),
    testSalesAccess
);


// Test action permission
router.post(
    "/sales/invoice",
    authMiddleware,
    requirePagePermission("sales"),
    requireActionPermission("sales", "create_invoice"),
    testCreateInvoiceAccess
);

router.get(
    "/inventory",
    authMiddleware,
    requirePagePermission("inventory"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Inventory access granted",
        });
    }
);


router.post(
    "/sales/cancel-invoice",
    authMiddleware,
    requirePagePermission("sales"),
    requireActionPermission("sales", "cancel_invoice"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Cancel invoice access granted",
        });
    }
);

module.exports = router;
const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const controller = require("./return.controller");
const { validateReturn } = require("./return.validation");

// ============================================================
// Get all returns
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission("returns"),
    requireActionPermission("returns", "view_returns"),
    controller.getReturns
);

// ============================================================
// Create return
// ============================================================

router.post(
    "/",
    authMiddleware,
    requirePagePermission("returns"),
    requireActionPermission("returns", "create_return"),
    validateReturn,
    controller.createReturn
);

// ============================================================
// Approve return
// ============================================================

router.patch(
    "/:id/approve",
    authMiddleware,
    requirePagePermission("returns"),
    requireActionPermission("returns", "approve_return"),
    controller.approveReturn
);

// ============================================================
// Cancel return
// ============================================================

router.patch(
    "/:id/cancel",
    authMiddleware,
    requirePagePermission("returns"),
    requireActionPermission("returns", "cancel_return"),
    controller.cancelReturn
);

// ============================================================
// Get return by ID
// ============================================================

router.get(
    "/:id",
    authMiddleware,
    requirePagePermission("returns"),
    requireActionPermission("returns", "view_returns"),
    controller.getReturnById
);

// ============================================================
// Update return
// ============================================================

router.put(
    "/:id",
    authMiddleware,
    requirePagePermission("returns"),
    requireActionPermission("returns", "edit_return"),
    validateReturn,
    controller.updateReturn
);

// ============================================================
// Delete return
// ============================================================

router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission("returns"),
    requireActionPermission("returns", "delete_return"),
    controller.deleteReturn
);

module.exports = router;

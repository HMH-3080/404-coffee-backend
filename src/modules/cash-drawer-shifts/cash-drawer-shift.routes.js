const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    validateShiftOpening,
    validateShiftClosing,
    validateCashIn,
    validateCashOut,
} = require("./cash-drawer-shift.validation");

const {
    getShifts,
    getShiftById,
    getCurrentShift,
    openShift,
    closeShift,
    recordCashIn,
    recordCashOut,
} = require("./cash-drawer-shift.controller");

const router = express.Router();

const PAGE = "cash_drawer_shifts";

// ============================================================
// Get all shifts
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_shifts_report"),
    getShifts
);

// ============================================================
// Get current shift
// ============================================================

router.get(
    "/current",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_shifts_report"),
    getCurrentShift
);

// ============================================================
// Get shift by ID
// ============================================================

router.get(
    "/:id",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_shifts_report"),
    getShiftById
);

// ============================================================
// Open shift
// ============================================================

router.post(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "open_shift"),
    validateShiftOpening,
    openShift
);

// ============================================================
// Close shift
// ============================================================

router.post(
    "/:id/close",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "close_shift"),
    validateShiftClosing,
    closeShift
);

// ============================================================
// Record cash in transaction
// ============================================================

router.post(
    "/:id/cash-in",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "record_cash_in"),
    validateCashIn,
    recordCashIn
);

// ============================================================
// Record cash out transaction
// ============================================================

router.post(
    "/:id/cash-out",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "record_cash_out"),
    validateCashOut,
    recordCashOut
);

module.exports = router;

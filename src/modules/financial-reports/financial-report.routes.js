const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    getSalesReport,
    getProfitReport,
    getTreasuryReport,
} = require("./financial-report.controller");

const router = express.Router();

const PAGE = "financial_reports";

// ============================================================
// Sales report
// ============================================================

router.get(
    "/sales",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_sales_report"),
    getSalesReport
);

// ============================================================
// Profit report
// ============================================================

router.get(
    "/profit",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_profit_report"),
    getProfitReport
);

// ============================================================
// Treasury report
// ============================================================

router.get(
    "/treasury",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_treasury_report"),
    getTreasuryReport
);

module.exports = router;

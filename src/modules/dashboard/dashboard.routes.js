const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
} = require("../../middlewares/permission.middleware");

const { getDashboard } = require("./dashboard.controller");

const router = express.Router();

const PAGE = "dashboard";

// ============================================================
// Get dashboard summary
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    getDashboard
);

module.exports = router;
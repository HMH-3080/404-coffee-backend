const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    getWarnings,
} = require("./warning.controller");

const router = express.Router();

const PAGE = "warnings";

// ============================================================
// Get inventory warnings
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_warnings"),
    getWarnings
);

module.exports = router;

const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    getAuditLogs,
    getAuditLogById,
} = require("./audit-log.controller");

const router = express.Router();

const PAGE = "audit_log";

// ============================================================
// Get audit logs
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_audit_log"),
    getAuditLogs
);

// ============================================================
// Get audit log by ID
// ============================================================

router.get(
    "/:id",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_audit_log"),
    getAuditLogById
);

module.exports = router;

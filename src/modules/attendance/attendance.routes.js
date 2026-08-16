const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    getAttendance,
    checkIn,
    checkOut,
    fingerprintCheckInOut,
    getAttendanceSummary,
} = require("./attendance.controller");

const router = express.Router();

const PAGE = "attendance";

// ============================================================
// Get attendance records (filters: userId, status, from, to)
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_attendance"),
    getAttendance
);

// ============================================================
// Attendance summary / performance
// ============================================================

router.get(
    "/summary",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_attendance"),
    getAttendanceSummary
);

// ============================================================
// Check in
// ============================================================

router.post(
    "/check-in",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "check_in"),
    checkIn
);

// ============================================================
// Check out
// ============================================================

router.post(
    "/check-out",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "check_out"),
    checkOut
);

// ============================================================
// Fingerprint check-in / check-out
// (public — no JWT needed, the fingerprint is the identity)
// ============================================================

router.post(
    "/fingerprint",
    fingerprintCheckInOut
);

module.exports = router;
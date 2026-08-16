const attendanceService = require("./attendance.service");

// ============================================================
// Get attendance records
// ============================================================

const getAttendance = async (req, res, next) => {
    try {
        const records = await attendanceService.getAttendance(req.query);

        res.status(200).json({
            success: true,
            data: records,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Check in
// ============================================================

const checkIn = async (req, res, next) => {
    try {
        const record = await attendanceService.checkIn({
            userId: req.user.userId,
            ...req.body,
        });

        res.status(201).json({
            success: true,
            message: "Checked in successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Check out
// ============================================================

const checkOut = async (req, res, next) => {
    try {
        const record = await attendanceService.checkOut({
            userId: req.user.userId,
        });

        res.status(200).json({
            success: true,
            message: "Checked out successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Attendance summary / performance
// ============================================================

const getAttendanceSummary = async (req, res, next) => {
    try {
        const summary = await attendanceService.getAttendanceSummary(
            req.query
        );

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Fingerprint check-in / check-out (public — fingerprint is the
// identity; toggles between check-in and check-out)
// ============================================================

const fingerprintCheckInOut = async (req, res, next) => {
    try {
        const result = await attendanceService.fingerprintCheckInOut(
            req.body
        );

        res.status(200).json({
            success: true,
            message: `Employee ${result.action} successfully`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAttendance,
    checkIn,
    checkOut,
    fingerprintCheckInOut,
    getAttendanceSummary,
};
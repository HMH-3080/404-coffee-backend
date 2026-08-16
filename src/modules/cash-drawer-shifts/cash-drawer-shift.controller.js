const cashDrawerShiftService = require("./cash-drawer-shift.service");

// ============================================================
// Get all shifts
// ============================================================

const getShifts = async (req, res, next) => {
    try {
        const shifts = await cashDrawerShiftService.getShifts();

        res.status(200).json({
            success: true,
            data: shifts,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Get current shift
// ============================================================

const getCurrentShift = async (req, res, next) => {
    try {
        const shift = await cashDrawerShiftService.getCurrentShift();

        res.status(200).json({
            success: true,
            data: shift,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Get shift by ID
// ============================================================

const getShiftById = async (req, res, next) => {
    try {
        const shift = await cashDrawerShiftService.getShiftById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: shift,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Open shift
// ============================================================

const openShift = async (req, res, next) => {
    try {
        const shift = await cashDrawerShiftService.openShift(
            req.body,
            req.user.userId,
            req.ip
        );

        res.status(201).json({
            success: true,
            message: "Shift opened successfully",
            data: shift,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Close shift
// ============================================================

const closeShift = async (req, res, next) => {
    try {
        const shift = await cashDrawerShiftService.closeShift(
            req.params.id,
            req.body,
            req.user.userId,
            req.ip
        );

        res.status(200).json({
            success: true,
            message: "Shift closed successfully",
            data: shift,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Record cash in transaction
// ============================================================

const recordCashIn = async (req, res, next) => {
    try {
        const transaction = await cashDrawerShiftService.recordCashIn(
            req.params.id,
            req.body,
            req.user.userId,
            req.ip
        );

        res.status(201).json({
            success: true,
            message: "Cash in recorded successfully",
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Record cash out transaction
// ============================================================

const recordCashOut = async (req, res, next) => {
    try {
        const transaction = await cashDrawerShiftService.recordCashOut(
            req.params.id,
            req.body,
            req.user.userId,
            req.ip
        );

        res.status(201).json({
            success: true,
            message: "Cash out recorded successfully",
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getShifts,
    getShiftById,
    getCurrentShift,
    openShift,
    closeShift,
    recordCashIn,
    recordCashOut,
};

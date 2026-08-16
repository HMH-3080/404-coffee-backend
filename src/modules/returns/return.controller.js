const returnService = require("./return.service");
const { logAudit } = require("../../utils/audit");


// ============================================================
// Create
// ============================================================

const createReturn = async (req, res, next) => {
    try {
        const result =
            await returnService.createReturn(req.body);


        await logAudit(req, "returns", "create_return", "Return created successfully");
        return res.status(201).json({
            success: true,
            message: "Return created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================================
// Get all
// ============================================================

const getReturns = async (req, res, next) => {
    try {
        const result =
            await returnService.getReturns(req.query);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================================
// Get by ID
// ============================================================

const getReturnById = async (req, res, next) => {
    try {
        const result =
            await returnService.getReturnById(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================================
// Update
// ============================================================

const updateReturn = async (req, res, next) => {
    try {
        const result =
            await returnService.updateReturn(
                req.params.id,
                req.body
            );


        await logAudit(req, "returns", "edit_return", "Return updated successfully");
        return res.status(200).json({
            success: true,
            message: "Return updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================================
// Approve
// ============================================================

const approveReturn = async (req, res, next) => {
    try {
        const result =
            await returnService.approveReturn(
                req.params.id
            );


        await logAudit(req, "returns", "approve_return", "Return approved successfully");
        return res.status(200).json({
            success: true,
            message: "Return approved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================================
// Cancel
// ============================================================

const cancelReturn = async (req, res, next) => {
    try {
        const result =
            await returnService.cancelReturn(
                req.params.id
            );


        await logAudit(req, "returns", "cancel_return", "Return cancelled successfully");
        return res.status(200).json({
            success: true,
            message: "Return cancelled successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================================
// Delete
// ============================================================

const deleteReturn = async (req, res, next) => {
    try {
        const result =
            await returnService.deleteReturn(
                req.params.id
            );


        await logAudit(req, "returns", "delete_return", "Return deleted successfully");
        return res.status(200).json({
            success: true,
            message: "Return deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createReturn,
    getReturns,
    getReturnById,
    updateReturn,
    approveReturn,
    cancelReturn,
    deleteReturn,
};
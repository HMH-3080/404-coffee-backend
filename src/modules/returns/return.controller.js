const returnService = require("./return.service");


// ============================================================
// Create
// ============================================================

const createReturn = async (req, res) => {
    try {
        const result =
            await returnService.createReturn(req.body);

        return res.status(201).json({
            success: true,
            message: "Return created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Create return error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ============================================================
// Get all
// ============================================================

const getReturns = async (req, res) => {
    try {
        const result =
            await returnService.getReturns(req.query);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Get returns error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ============================================================
// Get by ID
// ============================================================

const getReturnById = async (req, res) => {
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
        console.error("Get return error:", error);

        const statusCode =
            error.message === "Return not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};


// ============================================================
// Update
// ============================================================

const updateReturn = async (req, res) => {
    try {
        const result =
            await returnService.updateReturn(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Return updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("Update return error:", error);

        const statusCode =
            error.message === "Return not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};


// ============================================================
// Approve
// ============================================================

const approveReturn = async (req, res) => {
    try {
        const result =
            await returnService.approveReturn(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message: "Return approved successfully",
            data: result,
        });
    } catch (error) {
        console.error("Approve return error:", error);

        const statusCode =
            error.message === "Return not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};


// ============================================================
// Cancel
// ============================================================

const cancelReturn = async (req, res) => {
    try {
        const result =
            await returnService.cancelReturn(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message: "Return cancelled successfully",
            data: result,
        });
    } catch (error) {
        console.error("Cancel return error:", error);

        const statusCode =
            error.message === "Return not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};


// ============================================================
// Delete
// ============================================================

const deleteReturn = async (req, res) => {
    try {
        const result =
            await returnService.deleteReturn(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message: "Return deleted successfully",
            data: result,
        });
    } catch (error) {
        console.error("Delete return error:", error);

        const statusCode =
            error.message === "Return not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
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
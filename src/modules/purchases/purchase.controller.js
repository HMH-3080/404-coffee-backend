const purchaseService = require("./purchase.service");

// Get all purchases
const getPurchases = async (req, res, next) => {
    try {
        const purchases = await purchaseService.getPurchases();

        res.status(200).json({
            success: true,
            data: purchases,
        });
    } catch (error) {
        next(error);
    }
};

// Get purchase by ID
const getPurchaseById = async (req, res, next) => {
    try {
        const purchase =
            await purchaseService.getPurchaseById(req.params.id);

        res.status(200).json({
            success: true,
            data: purchase,
        });
    } catch (error) {
        next(error);
    }
};

// Create purchase
const createPurchase = async (req, res, next) => {
    try {
        const purchase =
            await purchaseService.createPurchase(req.body);

        res.status(201).json({
            success: true,
            message: "Purchase created successfully",
            data: purchase,
        });
    } catch (error) {
        next(error);
    }
};

// Update purchase
const updatePurchase = async (req, res, next) => {
    try {
        const purchase =
            await purchaseService.updatePurchase(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Purchase updated successfully",
            data: purchase,
        });
    } catch (error) {
        next(error);
    }
};

// Approve purchase
const approvePurchase = async (req, res, next) => {
    try {
        const purchase =
            await purchaseService.approvePurchase(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Purchase approved successfully",
            data: purchase,
        });
    } catch (error) {
        next(error);
    }
};

// Cancel purchase
const cancelPurchase = async (req, res, next) => {
    try {
        const purchase =
            await purchaseService.cancelPurchase(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Purchase cancelled successfully",
            data: purchase,
        });
    } catch (error) {
        next(error);
    }
};

// Delete purchase
const deletePurchase = async (req, res, next) => {
    try {
        const purchase =
            await purchaseService.deletePurchase(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Purchase deleted successfully",
            data: purchase,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPurchases,
    getPurchaseById,
    createPurchase,
    updatePurchase,
    approvePurchase,
    cancelPurchase,
    deletePurchase,
};

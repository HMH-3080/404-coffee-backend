const saleService = require("./sale.service");
const { logAudit } = require("../../utils/audit");

// ============================================================
// Get all sales
// ============================================================

const getSales = async (req, res, next) => {
    try {
        const sales = await saleService.getSales(req.query);

        res.status(200).json({
            success: true,
            data: sales,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Get sale by ID
// ============================================================

const getSaleById = async (req, res, next) => {
    try {
        const sale = await saleService.getSaleById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Create sale
// ============================================================

const createSale = async (req, res, next) => {
    try {
        const sale = await saleService.createSale(req.body);


                // Record in audit log
                await logAudit(req, "sales", "create_invoice", "Sale created successfully");        res.status(201).json({
            success: true,
            message: "Sale created successfully",
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};


// ============================================================
// Update sale
// ============================================================

const updateSale = async (req, res, next) => {
    try {
        const sale = await saleService.updateSale(
            req.params.id,
            req.body
        );


                // Record in audit log
                await logAudit(req, "sales", "edit_invoice", "Sale updated successfully");        res.status(200).json({
            success: true,
            message: "Sale updated successfully",
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Delete sale
// ============================================================

const deleteSale = async (req, res, next) => {
    try {
        const sale = await saleService.deleteSale(
            req.params.id
        );


                // Record in audit log
                await logAudit(req, "sales", "cancel_invoice", "Sale deleted successfully");        res.status(200).json({
            success: true,
            message: "Sale deleted successfully",
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
};
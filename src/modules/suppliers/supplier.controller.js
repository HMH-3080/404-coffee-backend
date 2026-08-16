const supplierService = require("./supplier.service");
const { logAudit } = require("../../utils/audit");

// Get all suppliers

const getSuppliers = async (req, res, next) => {

    try {

        const suppliers = await supplierService.getSuppliers();

        res.status(200).json({
            success: true,
            data: suppliers,
        })

    } catch (error) {
        next(error);
    }
}


// Get supplier by ID 

const getSupplierById = async (req, res, next) => {
    try {

        const supplier = await supplierService.getSupplierById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: supplier,
        })

    } catch (error) {
        next(error);
    }
}


// Create supplier

const createSupplier = async (req, res, next) => {
    try {
        const supplier = await supplierService.createSupplier(
            req.body
        );


                // Record in audit log
                await logAudit(req, "suppliers", "create_supplier", "Supplier created successfully");        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: supplier,
        });

    } catch(error) {
        next(error);
    }
}


// Update supplier

const updateSupplier = async (req, res, next) => {
    try {

        const supplier = await supplierService.updateSupplier(
            req.params.id,
            req.body,
        );


                // Record in audit log
                await logAudit(req, "suppliers", "edit_supplier", "Supplier updated successfully");        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: supplier,
        })

    } catch(error) {
        next(error);
    }
}

// Delete supplier
const deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await supplierService.deleteSupplier(
            req.params.id
        );


                // Record in audit log
                await logAudit(req, "suppliers", "delete_supplier", "Supplier deleted successfully");        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully",
            data: supplier,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
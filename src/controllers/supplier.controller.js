const supplierService = require("../services/supplier.service");

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

        res.status(201).json({
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

        res.status(200).json({
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

        res.status(200).json({
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
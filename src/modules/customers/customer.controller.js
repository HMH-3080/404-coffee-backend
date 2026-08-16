const customerService = require("./customer.service");

// ============================================================
// Get all customers
// ============================================================

const getCustomers = async (req, res, next) => {
    try {
        const customers = await customerService.getCustomers(
            req.query
        );

        res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Get customer by ID
// ============================================================

const getCustomerById = async (req, res, next) => {
    try {
        const customer =
            await customerService.getCustomerById(
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Create customer
// ============================================================

const createCustomer = async (req, res, next) => {
    try {
        const customer =
            await customerService.createCustomer(req.body);

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Update customer
// ============================================================

const updateCustomer = async (req, res, next) => {
    try {
        const customer =
            await customerService.updateCustomer(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Delete customer
// ============================================================

const deleteCustomer = async (req, res, next) => {
    try {
        const customer =
            await customerService.deleteCustomer(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
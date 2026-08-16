const customerService = require("./customer.service");
const { logAudit } = require("../../utils/audit");

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


                // Record in audit log
                await logAudit(req, "customers", "create_customer", "Customer created successfully");        res.status(201).json({
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


                // Record in audit log
                await logAudit(req, "customers", "edit_customer", "Customer updated successfully");        res.status(200).json({
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


                // Record in audit log
                await logAudit(req, "customers", "delete_customer", "Customer deleted successfully");        res.status(200).json({
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
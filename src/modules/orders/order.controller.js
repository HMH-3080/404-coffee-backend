const orderService = require("./order.service");

// ============================================================
// Create order
// POST /api/orders
// ============================================================

const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// Get all orders
// GET /api/orders
// ============================================================

const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrders(req.query);

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// Get order by ID
// GET /api/orders/:id
// ============================================================

const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Get order error:", error);

        const statusCode =
            error.message === "Order not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// Update order
// PUT /api/orders/:id
// ============================================================

const updateOrder = async (req, res) => {
    try {
        const order = await orderService.updateOrder(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order,
        });
    } catch (error) {
        console.error("Update order error:", error);

        const statusCode =
            error.message === "Order not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================================
// Delete order
// DELETE /api/orders/:id
// ============================================================

const deleteOrder = async (req, res) => {
    try {
        const order = await orderService.deleteOrder(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: order,
        });
    } catch (error) {
        console.error("Delete order error:", error);

        const statusCode =
            error.message === "Order not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
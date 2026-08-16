const express = require("express");

const orderController = require("./order.controller");
const { validateOrder } = require("./order.validation");
const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
} = require("../../middlewares/permission.middleware");

const router = express.Router();

const PAGE = "orders";

// Create order
router.post(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    validateOrder,
    orderController.createOrder
);

// Get all orders
router.get(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    orderController.getOrders
);

// Get order by ID
router.get(
    "/:id",
    authMiddleware,
    requirePagePermission(PAGE),
    orderController.getOrderById
);

// Update order
router.put(
    "/:id",
    authMiddleware,
    requirePagePermission(PAGE),
    validateOrder,
    orderController.updateOrder
);

// Delete order
router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission(PAGE),
    orderController.deleteOrder
);

module.exports = router;
const prisma = require("../../lib/prisma");

// ============================================================
// Helpers
// ============================================================

const getOrderInclude = {
    customer: true,

    items: {
        include: {
            product: true,
            productSize: true,
        },
    },
};

const validateAndPrepareItems = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Order must contain at least one item");
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
        const productId = Number(item.productId);
        const productSizeId = Number(item.productSizeId);
        const quantity = Number(item.quantity);

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            throw new Error(
                `Product with ID ${item.productId} not found`
            );
        }

        const productSize = await prisma.productSize.findUnique({
            where: {
                id: productSizeId,
            },
        });

        if (!productSize) {
            throw new Error(
                `Product size with ID ${item.productSizeId} not found`
            );
        }

        if (productSize.productId !== product.id) {
            throw new Error(
                `Product size ${item.productSizeId} does not belong to product ${item.productId}`
            );
        }

        const unitPrice = Number(productSize.finalPrice);
        const totalPrice = unitPrice * quantity;

        subtotal += totalPrice;

        orderItems.push({
            productId: product.id,
            productSizeId: productSize.id,
            quantity,
            unitPrice,
            totalPrice,
        });
    }

    return {
        orderItems,
        subtotal,
    };
};

// ============================================================
// Create order
// ============================================================

const createOrder = async (data) => {
    const {
        customerId,
        orderType = "DINE_IN",
        phone,
        discount = 0,
        paymentMethod = "CASH",
        notes,
        items,
    } = data;

    // --------------------------------------------------------
    // Validate customer
    // --------------------------------------------------------

    if (customerId !== undefined && customerId !== null) {
        const customer = await prisma.customer.findUnique({
            where: {
                id: Number(customerId),
            },
        });

        if (!customer) {
            throw new Error("Customer not found");
        }
    }

    // --------------------------------------------------------
    // Validate items + calculate subtotal
    // --------------------------------------------------------

    const { orderItems, subtotal } =
        await validateAndPrepareItems(items);

    // --------------------------------------------------------
    // Calculate total
    // --------------------------------------------------------

    const discountValue = Number(discount) || 0;

    if (discountValue < 0) {
        throw new Error("Discount cannot be negative");
    }

    if (discountValue > subtotal) {
        throw new Error("Discount cannot be greater than subtotal");
    }

    const total = subtotal - discountValue;

    // --------------------------------------------------------
    // Create order
    // --------------------------------------------------------

    const order = await prisma.order.create({
        data: {
            customerId:
                customerId !== undefined && customerId !== null
                    ? Number(customerId)
                    : null,

            orderType,
            phone: phone || null,

            subtotal,
            discount: discountValue,
            total,

            paymentMethod,
            notes: notes || null,

            items: {
                create: orderItems,
            },
        },

        include: getOrderInclude,
    });

    return order;
};

// ============================================================
// Get all orders
// ============================================================

const getOrders = async (filters = {}) => {
    const {
        status,
        orderType,
        paymentMethod,
        customerId,
    } = filters;

    const where = {};

    if (status) {
        where.status = status;
    }

    if (orderType) {
        where.orderType = orderType;
    }

    if (paymentMethod) {
        where.paymentMethod = paymentMethod;
    }

    if (customerId !== undefined && customerId !== "") {
        where.customerId = Number(customerId);
    }

    const orders = await prisma.order.findMany({
        where,

        include: getOrderInclude,

        orderBy: {
            createdAt: "desc",
        },
    });

    return orders;
};

// ============================================================
// Get order by ID
// ============================================================

const getOrderById = async (id) => {
    const order = await prisma.order.findUnique({
        where: {
            id: Number(id),
        },

        include: getOrderInclude,
    });

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

// ============================================================
// Update order
// ============================================================

const updateOrder = async (id, data) => {
    const orderId = Number(id);

    const existingOrder = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!existingOrder) {
        throw new Error("Order not found");
    }

    const {
        customerId,
        orderType,
        phone,
        discount,
        paymentMethod,
        status,
        notes,
        items,
    } = data;

    // --------------------------------------------------------
    // Validate customer
    // --------------------------------------------------------

    if (customerId !== undefined && customerId !== null) {
        const customer = await prisma.customer.findUnique({
            where: {
                id: Number(customerId),
            },
        });

        if (!customer) {
            throw new Error("Customer not found");
        }
    }

    // --------------------------------------------------------
    // Prepare basic update data
    // --------------------------------------------------------

    const updateData = {};

    if (customerId !== undefined) {
        updateData.customerId =
            customerId === null ? null : Number(customerId);
    }

    if (orderType !== undefined) {
        updateData.orderType = orderType;
    }

    if (phone !== undefined) {
        updateData.phone = phone;
    }

    if (paymentMethod !== undefined) {
        updateData.paymentMethod = paymentMethod;
    }

    if (status !== undefined) {
        updateData.status = status;
    }

    if (notes !== undefined) {
        updateData.notes = notes;
    }

    // --------------------------------------------------------
    // Update items
    // --------------------------------------------------------

    if (items !== undefined) {
        const { orderItems, subtotal } =
            await validateAndPrepareItems(items);

        const discountValue =
            discount !== undefined
                ? Number(discount)
                : Number(existingOrder.discount);

        if (discountValue < 0) {
            throw new Error("Discount cannot be negative");
        }

        if (discountValue > subtotal) {
            throw new Error(
                "Discount cannot be greater than subtotal"
            );
        }

        updateData.subtotal = subtotal;
        updateData.discount = discountValue;
        updateData.total = subtotal - discountValue;

        // ----------------------------------------------------
        // IMPORTANT:
        // Delete and recreate items inside transaction
        // ----------------------------------------------------

        const order = await prisma.$transaction(async (tx) => {
            await tx.orderItem.deleteMany({
                where: {
                    orderId,
                },
            });

            return tx.order.update({
                where: {
                    id: orderId,
                },

                data: {
                    ...updateData,

                    items: {
                        create: orderItems,
                    },
                },

                include: getOrderInclude,
            });
        });

        return order;
    }

    // --------------------------------------------------------
    // Update discount only
    // --------------------------------------------------------

    if (discount !== undefined) {
        const discountValue = Number(discount);

        if (discountValue < 0) {
            throw new Error("Discount cannot be negative");
        }

        if (
            discountValue >
            Number(existingOrder.subtotal)
        ) {
            throw new Error(
                "Discount cannot be greater than subtotal"
            );
        }

        updateData.discount = discountValue;

        updateData.total =
            Number(existingOrder.subtotal) - discountValue;
    }

    // --------------------------------------------------------
    // Update order
    // --------------------------------------------------------

    const order = await prisma.order.update({
        where: {
            id: orderId,
        },

        data: updateData,

        include: getOrderInclude,
    });

    return order;
};

// ============================================================
// Delete order
// ============================================================

const deleteOrder = async (id) => {
    const orderId = Number(id);

    const existingOrder = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!existingOrder) {
        throw new Error("Order not found");
    }

    const order = await prisma.order.delete({
        where: {
            id: orderId,
        },

        include: getOrderInclude,
    });

    return order;
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
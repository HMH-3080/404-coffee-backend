const prisma = require("../../lib/prisma");

const createSale = async ({ items }) => {
    if (!Array.isArray(items) || items.length === 0) {
        const error = new Error("Sale items are required");
        error.statusCode = 400;
        throw error;
    }

    return prisma.$transaction(async (tx) => {
        let saleTotal = 0;
        const saleItems = [];

        for (const item of items) {
            const productId = Number(item.productId);
            const productSizeId = Number(item.productSizeId);
            const quantity = Number(item.quantity);

            if (!productId || !productSizeId || !quantity || quantity <= 0) {
                const error = new Error("Invalid sale item data");
                error.statusCode = 400;
                throw error;
            }

            const productSize = await tx.productSize.findFirst({
                where: {
                    id: productSizeId,
                    productId,
                },
                include: {
                    ingredients: true,
                },
            });

            if (!productSize) {
                const error = new Error("Product size not found");
                error.statusCode = 404;
                throw error;
            }

            const itemTotal =
                Number(productSize.finalPrice) * quantity;

            saleTotal += itemTotal;

            // خصم المواد الخام حسب أقرب expiry date
            for (const ingredient of productSize.ingredients) {
                let requiredQuantity =
                    Number(ingredient.quantity) * quantity;

                const batches = await tx.rawMaterialBatch.findMany({
                    where: {
                        rawMaterialId: ingredient.rawMaterialId,
                        quantity: {
                            gt: 0,
                        },
                    },
                    orderBy: [
                        {
                            expiryDate: "asc",
                        },
                        {
                            addedAt: "asc",
                        },
                    ],
                });

                const availableQuantity = batches.reduce(
                    (total, batch) =>
                        total + Number(batch.quantity),
                    0
                );

                if (availableQuantity < requiredQuantity) {
                    const error = new Error(
                        `Insufficient stock for raw material ${ingredient.rawMaterialId}`
                    );
                    error.statusCode = 400;
                    throw error;
                }

                for (const batch of batches) {
                    if (requiredQuantity <= 0) {
                        break;
                    }

                    const batchQuantity = Number(batch.quantity);

                    const deducted = Math.min(
                        batchQuantity,
                        requiredQuantity
                    );

                    await tx.rawMaterialBatch.update({
                        where: {
                            id: batch.id,
                        },
                        data: {
                            quantity: {
                                decrement: deducted,
                            },
                        },
                    });

                    requiredQuantity -= deducted;
                }
            }

            saleItems.push({
                productId,
                productSizeId,
                quantity,
                unitPrice: productSize.finalPrice,
                totalPrice: itemTotal,
            });
        }

        const sale = await tx.sale.create({
            data: {
                total: saleTotal,
                items: {
                    create: saleItems,
                },
            },
            include: {
                items: true,
            },
        });

        return sale;
    });
};

module.exports = {
    createSale,
};
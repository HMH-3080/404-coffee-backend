const prisma = require("../../lib/prisma");

const IN_TYPES = ["SALES", "COLLECTION"];
const OUT_TYPES = ["EXPENSE", "SALARY", "MAINTENANCE", "PURCHASE", "INCENTIVE"];

const buildDateWhere = (field, { from, to }) => {
    if (!from && !to) {
        return {};
    }

    const range = {};

    if (from) {
        range.gte = new Date(from);
    }

    if (to) {
        range.lte = new Date(to);
    }

    return {
        [field]: range,
    };
};

// ============================================================
// Sales report
// ============================================================

const getSalesReport = async (query = {}) => {
    const sales = await prisma.sale.findMany({
        where: buildDateWhere("createdAt", query),
        orderBy: {
            createdAt: "desc",
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                },
            },
            items: true,
        },
    });

    let subtotal = 0;
    let discount = 0;
    let total = 0;

    const byPaymentMethod = {};

    for (const sale of sales) {
        subtotal += Number(sale.subtotal);
        discount += Number(sale.discount);
        total += Number(sale.total);

        byPaymentMethod[sale.paymentMethod] =
            (byPaymentMethod[sale.paymentMethod] || 0) +
            Number(sale.total);
    }

    const rounded = (value) => Math.round(value * 100) / 100;

    return {
        summary: {
            salesCount: sales.length,
            subtotal: rounded(subtotal),
            discount: rounded(discount),
            total: rounded(total),
            byPaymentMethod,
        },
        sales,
    };
};

// ============================================================
// Profit report
// ============================================================

const getProfitReport = async (query = {}) => {
    const sales = await prisma.sale.findMany({
        where: buildDateWhere("createdAt", query),
        orderBy: {
            createdAt: "desc",
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    productSize: true,
                },
            },
        },
    });

    const rounded = (value) => Math.round(value * 100) / 100;

    let revenue = 0;
    let estimatedCost = 0;

    for (const sale of sales) {
        for (const item of sale.items) {
            revenue += Number(item.totalPrice);

            if (item.productSize && item.productSize.basePrice) {
                estimatedCost +=
                    Number(item.productSize.basePrice) *
                    Number(item.quantity);
            }
        }
    }

    const profit = rounded(revenue - estimatedCost);
    const profitMargin =
        revenue > 0 ? rounded((profit / revenue) * 100) : 0;

    return {
        summary: {
            revenue: rounded(revenue),
            estimatedCost: rounded(estimatedCost),
            profit,
            profitMargin,
        },
    };
};

// ============================================================
// Treasury report (cash drawer shifts)
// ============================================================

const getTreasuryReport = async (query = {}) => {
    const shifts = await prisma.cashDrawerShift.findMany({
        where: buildDateWhere("openedAt", query),
        orderBy: {
            openedAt: "desc",
        },
        include: {
            openedByUser: {
                select: {
                    id: true,
                    name: true,
                },
            },
            closedByUser: {
                select: {
                    id: true,
                    name: true,
                },
            },
            transactions: true,
        },
    });

    const rounded = (value) => Math.round(value * 100) / 100;

    let openingTotal = 0;
    let totalIn = 0;
    let totalOut = 0;
    let closingTotal = 0;
    let differenceTotal = 0;

    for (const shift of shifts) {
        openingTotal += Number(shift.openingBalance);

        if (shift.closingBalance) {
            closingTotal += Number(shift.closingBalance);
        }

        if (shift.difference) {
            differenceTotal += Number(shift.difference);
        }

        for (const transaction of shift.transactions) {
            if (IN_TYPES.includes(transaction.type)) {
                totalIn += Number(transaction.amount);
            } else if (OUT_TYPES.includes(transaction.type)) {
                totalOut += Number(transaction.amount);
            }
        }
    }

    return {
        summary: {
            shiftsCount: shifts.length,
            openingTotal: rounded(openingTotal),
            totalIn: rounded(totalIn),
            totalOut: rounded(totalOut),
            closingTotal: rounded(closingTotal),
            differenceTotal: rounded(differenceTotal),
        },
        shifts,
    };
};

module.exports = {
    getSalesReport,
    getProfitReport,
    getTreasuryReport,
};

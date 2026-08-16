const prisma = require("../../lib/prisma");

// ============================================================
// Get audit logs
// ============================================================

const getAuditLogs = async ({ page, action, userId, from, to, limit } = {}) => {
    const where = {};

    if (page) {
        where.page = page;
    }

    if (action) {
        where.action = action;
    }

    if (userId) {
        const parsedUserId = Number(userId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        where.userId = parsedUserId;
    }

    if (from || to) {
        where.createdAt = {};

        if (from) {
            where.createdAt.gte = new Date(from);
        }

        if (to) {
            where.createdAt.lte = new Date(to);
        }
    }

    const parsedLimit = limit ? Math.min(Number(limit) || 100, 200) : 100;

    return prisma.auditLog.findMany({
        where,
        orderBy: {
            createdAt: "desc",
        },
        take: parsedLimit,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    position: true,
                },
            },
        },
    });
};

// ============================================================
// Get audit log by ID
// ============================================================

const getAuditLogById = async (id) => {
    const logId = Number(id);

    if (!Number.isInteger(logId) || logId <= 0) {
        const error = new Error("Invalid audit log ID");
        error.statusCode = 400;
        throw error;
    }

    const log = await prisma.auditLog.findUnique({
        where: {
            id: logId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    position: true,
                },
            },
        },
    });

    if (!log) {
        const error = new Error("Audit log not found");
        error.statusCode = 404;
        throw error;
    }

    return log;
};

module.exports = {
    getAuditLogs,
    getAuditLogById,
};

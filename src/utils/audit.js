const prisma = require("../lib/prisma");

// ============================================================
// Create audit log entry
// ============================================================

const createAuditLog = async ({
    userId,
    page,
    action,
    description,
    ipAddress,
}) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId: userId || null,
                page,
                action,
                description: description || null,
                ipAddress: ipAddress || null,
            },
        });
    } catch (error) {
        // Audit logging should never break the main flow
        console.error("Failed to create audit log:", error);
    }
};

module.exports = {
    createAuditLog,
};

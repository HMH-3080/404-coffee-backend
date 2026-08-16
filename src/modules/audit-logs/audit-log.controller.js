const auditLogService = require("./audit-log.service");

// ============================================================
// Get audit logs
// ============================================================

const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await auditLogService.getAuditLogs(req.query);

        res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Get audit log by ID
// ============================================================

const getAuditLogById = async (req, res, next) => {
    try {
        const log = await auditLogService.getAuditLogById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: log,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAuditLogs,
    getAuditLogById,
};

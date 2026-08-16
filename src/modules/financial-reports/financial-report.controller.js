const financialReportService = require("./financial-report.service");

// ============================================================
// Sales report
// ============================================================

const getSalesReport = async (req, res, next) => {
    try {
        const report = await financialReportService.getSalesReport(
            req.query
        );

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Profit report
// ============================================================

const getProfitReport = async (req, res, next) => {
    try {
        const report = await financialReportService.getProfitReport(
            req.query
        );

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

// ============================================================
// Treasury report
// ============================================================

const getTreasuryReport = async (req, res, next) => {
    try {
        const report = await financialReportService.getTreasuryReport(
            req.query
        );

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSalesReport,
    getProfitReport,
    getTreasuryReport,
};

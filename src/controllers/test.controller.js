const testSalesAccess = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Sales page access granted",
        user: req.user,
    });
};

const testCreateInvoiceAccess = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Create invoice access granted",
        user: req.user,
    });
};

module.exports = {
    testSalesAccess,
    testCreateInvoiceAccess,
};
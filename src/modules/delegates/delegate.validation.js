const validateDelegate = (req, res, next) => {
    const {
        name,
        whatsapp,
        phone,
    } = req.body;

    if (!name || !whatsapp || !phone) {
        return res.status(400).json({
            success: false,
            message: "Name, WhatsApp and phone are required",
        });
    }

    next();
};


const validateDelegateStatus = (req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status is required",
        });
    }

    if (!["AVAILABLE", "UNAVAILABLE"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid delegate status",
        });
    }

    next();
};


module.exports = {
    validateDelegate,
    validateDelegateStatus,
};
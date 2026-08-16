const jwt = require("jsonwebtoken");
const { chatWithAssistant } = require("./chat.service");

// ============================================================
// Optional auth: if a valid staff token is present, enable
// staff tools. Public users (customers) still get general chat
// + menu info.
// ============================================================

const resolveOptionalUser = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};

const chat = async (req, res, next) => {
    try {
        const user = resolveOptionalUser(req);

        const result = await chatWithAssistant({
            messages: req.body.messages,
            isStaff: Boolean(user),
        });

        res.status(200).json({
            success: true,
            data: {
                reply: result.content,
                isStaff: Boolean(user),
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    chat,
};
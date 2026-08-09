const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization required",
            });
        }

        // Check Bearer token format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is required",
            });
        }

        // verify JWT token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach authenticated user to request
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has exprired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        next(error);

    }
}

module.exports = authMiddleware;
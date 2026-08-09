const authService = require("../services/auth.service");

const loginUser = async (req, res, next) => {

    try {
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginUser,
}
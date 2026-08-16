const permissionService = require("./permission.service");

const getUserPermissions = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const permissions =
            await permissionService.getUserPermissionsForResponse(userId);

        res.status(200).json({
            success: true,
            data: permissions,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserPermissions,
};
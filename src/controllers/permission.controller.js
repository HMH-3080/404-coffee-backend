const permissionService = require("../services/permission.service");

const getUserPermissions = async (req, res, next) => {
    try {
        const permissions =
            await permissionService.getUserPermissions(req.params.id);

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
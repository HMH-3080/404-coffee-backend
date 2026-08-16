const prisma = require("../../lib/prisma");
const { pages } = require("../../config/permissions.config");

const getUserPermissionsForResponse = async (userId) => {
    const pagePermissions = await prisma.userPagePermission.findMany({
        where: {
            userId,
            enabled: true,
        },
        select: {
            page: true,
        },
    });

    const actionPermissions = await prisma.userActionPermission.findMany({
        where: {
            userId,
            enabled: true,
        },
        select: {
            page: true,
            action: true,
        },
    });

    const permissions = pagePermissions.map((pagePermission) => {
        const pageConfig = pages.find(
            (page) => page.page_key === pagePermission.page
        );

        if (!pageConfig) {
            return null;
        }

        const actions = actionPermissions
            .filter(
                (actionPermission) =>
                    actionPermission.page === pagePermission.page
            )
            .map((actionPermission) => actionPermission.action);

        return {
            ...pageConfig,
            actions,
        };
    }).filter(Boolean);

    return permissions;
};

module.exports = {
    getUserPermissionsForResponse,
};
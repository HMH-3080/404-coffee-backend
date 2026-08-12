const bcrypt = require("bcryptjs");

const prisma = require("../lib/prisma");

const createUser = async ({
    name,
    password,
    position,
    permissions = [],
}) => {

    // Check required data
    if (!name || !password || !position) {
        const error = new Error(
            "Name, password and position are required"
        );
        error.statusCode = 400;
        throw error;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with permissions
    const user = await prisma.user.create({
        data: {
            name,
            passwordHash,
            position,

            pagePermissions: {
                create: permissions.map((permission) => ({
                    page: permission.page,
                    enabled: true,
                })),
            },

            actionPermissions: {
                create: permissions.flatMap((permission) =>
                    (permission.actions || []).map((action) => ({
                        page: permission.page,
                        action,
                        enabled: true,
                    }))
                ),
            },
        },

        select: {
            id: true,
            name: true,
            position: true,
            status: true,
            createdAt: true,
        },
    });

    return user;
};

module.exports = {
    createUser,
};
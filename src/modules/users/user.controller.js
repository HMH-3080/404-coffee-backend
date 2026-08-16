/**
 * controllers/user.controller.js
 *
 * Employees / Users Controller
 *
 * Features:
 * - Get all users with permissions
 * - Create user with permissions
 * - Update user
 * - Activate / Suspend user
 * - Get user permissions
 * - Update user permissions
 * - Delete user
 */

const bcrypt = require("bcryptjs");

const prisma = require("../../lib/prisma");

const {
  getUserPermissionsForResponse,
} = require("./permission.service");

/**
 * =========================================================
 * GET ALL USERS
 * =========================================================
 *
 * GET /api/users
 *
 * Returns:
 * - User information
 * - Pages available for the user
 * - Actions available for each page
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
        fingerprintId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const usersWithPermissions = await Promise.all(
      users.map(async (user) => {
        const permissions =
          await getUserPermissionsForResponse(user.id);

        return {
          ...user,
          permissions,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithPermissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * CREATE USER
 * =========================================================
 *
 * POST /api/users
 *
 * Body example:
 *
 * {
 *   "name": "Mohamed",
 *   "password": "123456",
 *   "position": "CASHIER",
 *   "permissions": [
 *     {
 *       "page": "sales",
 *       "actions": [
 *         "view_products",
 *         "create_invoice"
 *       ]
 *     },
 *     {
 *       "page": "products",
 *       "actions": [
 *         "view_products"
 *       ]
 *     }
 *   ]
 * }
 */
const createUser = async (req, res, next) => {
  try {
    const {
      name,
      password,
      position,
      permissions = [],
      fingerprintId,
    } = req.body;

    // Validate required data
    if (!name || !password || !position) {
      const error = new Error(
        "Name, password and position are required"
      );

      error.statusCode = 400;
      throw error;
    }

    // Validate permissions
    if (!Array.isArray(permissions)) {
      const error = new Error(
        "permissions must be an array"
      );

      error.statusCode = 400;
      throw error;
    }

    // Validate every permission
    for (const permission of permissions) {
      if (!permission.page) {
        const error = new Error(
          "Each permission must contain page"
        );

        error.statusCode = 400;
        throw error;
      }

      if (
        permission.actions !== undefined &&
        !Array.isArray(permission.actions)
      ) {
        const error = new Error(
          "permission actions must be an array"
        );

        error.statusCode = 400;
        throw error;
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        name,
      },
    });

    if (existingUser) {
      const error = new Error("User already exists");

      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Check fingerprintId uniqueness
    if (fingerprintId !== undefined && fingerprintId !== "") {
      const existingFingerprint = await prisma.user.findUnique({
        where: {
          fingerprintId: String(fingerprintId),
        },
      });

      if (existingFingerprint) {
        const error = new Error(
          "Fingerprint ID already used by another employee"
        );

        error.statusCode = 409;
        throw error;
      }
    }

    // Create user + permissions
    const user = await prisma.user.create({
      data: {
        name,
        passwordHash,
        position,
        status: "ACTIVE",
        ...(fingerprintId !== undefined &&
          fingerprintId !== "" && {
            fingerprintId: String(fingerprintId),
          }),

        // Create page permissions
        pagePermissions: {
          create: permissions.map((permission) => ({
            page: permission.page,
            enabled: true,
          })),
        },

        // Create action permissions
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
        fingerprintId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * UPDATE USER
 * =========================================================
 *
 * PUT /api/users/:id
 *
 * Can update:
 * - name
 * - position
 * - password
 *
 * Partial update is supported.
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const {
      name,
      password,
      position,
      fingerprintId,
    } = req.body;

    // Validate ID
    if (!Number.isInteger(userId)) {
      const error = new Error("Invalid user ID");

      error.statusCode = 400;
      throw error;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      const error = new Error("User not found");

      error.statusCode = 404;
      throw error;
    }

    // Prepare update data
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (position !== undefined) {
      updateData.position = position;
    }

    // Update password only if provided
    if (
      password !== undefined &&
      password !== ""
    ) {
      updateData.passwordHash =
        await bcrypt.hash(password, 10);
    }

    // Set / clear fingerprintId
    if (fingerprintId !== undefined) {
      if (fingerprintId === "" || fingerprintId === null) {
        updateData.fingerprintId = null;
      } else {
        const existingFingerprint =
          await prisma.user.findUnique({
            where: {
              fingerprintId: String(fingerprintId),
            },
          });

        if (
          existingFingerprint &&
          existingFingerprint.id !== userId
        ) {
          const error = new Error(
            "Fingerprint ID already used by another employee"
          );

          error.statusCode = 409;
          throw error;
        }

        updateData.fingerprintId = String(fingerprintId);
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
        fingerprintId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * UPDATE USER STATUS
 * =========================================================
 *
 * PATCH /api/users/:id/status
 *
 * Body:
 *
 * {
 *   "status": "ACTIVE"
 * }
 *
 * OR
 *
 * {
 *   "status": "SUSPENDED"
 * }
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const { status } = req.body;

    // Validate ID
    if (!Number.isInteger(userId)) {
      const error = new Error("Invalid user ID");

      error.statusCode = 400;
      throw error;
    }

    // Validate status
    if (
      !["ACTIVE", "SUSPENDED"].includes(status)
    ) {
      const error = new Error(
        "Status must be ACTIVE or SUSPENDED"
      );

      error.statusCode = 400;
      throw error;
    }

    // Check user
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      const error = new Error("User not found");

      error.statusCode = 404;
      throw error;
    }

    // Update status
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status,
      },
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * GET USER PERMISSIONS
 * =========================================================
 *
 * GET /api/users/:id/permissions
 */
const getUserPermissions = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(userId)) {
      const error = new Error("Invalid user ID");

      error.statusCode = 400;
      throw error;
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");

      error.statusCode = 404;
      throw error;
    }

    // Get page permissions
    const pagePermissions =
      await prisma.userPagePermission.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          page: true,
          enabled: true,
        },
        orderBy: {
          page: "asc",
        },
      });

    // Get action permissions
    const actionPermissions =
      await prisma.userActionPermission.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          page: true,
          action: true,
          enabled: true,
        },
        orderBy: [
          {
            page: "asc",
          },
          {
            action: "asc",
          },
        ],
      });

    res.status(200).json({
      success: true,
      data: {
        user,
        pagePermissions,
        actionPermissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * UPDATE USER PERMISSIONS
 * =========================================================
 *
 * PUT /api/users/:id/permissions
 *
 * Body:
 *
 * {
 *   "pagePermissions": [
 *     {
 *       "page": "sales",
 *       "enabled": true
 *     }
 *   ],
 *
 *   "actionPermissions": [
 *     {
 *       "page": "sales",
 *       "action": "create_invoice",
 *       "enabled": true
 *     }
 *   ]
 * }
 */
const updateUserPermissions = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const {
      pagePermissions = [],
      actionPermissions = [],
    } = req.body;

    // Validate ID
    if (!Number.isInteger(userId)) {
      const error = new Error("Invalid user ID");

      error.statusCode = 400;
      throw error;
    }

    // Check user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");

      error.statusCode = 404;
      throw error;
    }

    // Validate arrays
    if (
      !Array.isArray(pagePermissions) ||
      !Array.isArray(actionPermissions)
    ) {
      const error = new Error(
        "pagePermissions and actionPermissions must be arrays"
      );

      error.statusCode = 400;
      throw error;
    }

    // Validate page permissions
    for (const permission of pagePermissions) {
      if (
        !permission.page ||
        typeof permission.enabled !== "boolean"
      ) {
        const error = new Error(
          "Each page permission must contain page and boolean enabled"
        );

        error.statusCode = 400;
        throw error;
      }
    }

    // Validate action permissions
    for (const permission of actionPermissions) {
      if (
        !permission.page ||
        !permission.action ||
        typeof permission.enabled !== "boolean"
      ) {
        const error = new Error(
          "Each action permission must contain page, action and boolean enabled"
        );

        error.statusCode = 400;
        throw error;
      }
    }

    // Update page permissions
    for (const permission of pagePermissions) {
      await prisma.userPagePermission.upsert({
        where: {
          userId_page: {
            userId,
            page: permission.page,
          },
        },

        update: {
          enabled: permission.enabled,
        },

        create: {
          userId,
          page: permission.page,
          enabled: permission.enabled,
        },
      });
    }

    // Update action permissions
    for (const permission of actionPermissions) {
      await prisma.userActionPermission.upsert({
        where: {
          userId_page_action: {
            userId,
            page: permission.page,
            action: permission.action,
          },
        },

        update: {
          enabled: permission.enabled,
        },

        create: {
          userId,
          page: permission.page,
          action: permission.action,
          enabled: permission.enabled,
        },
      });
    }

    // Get updated page permissions
    const updatedPagePermissions =
      await prisma.userPagePermission.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          page: true,
          enabled: true,
        },
        orderBy: {
          page: "asc",
        },
      });

    // Get updated action permissions
    const updatedActionPermissions =
      await prisma.userActionPermission.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          page: true,
          action: true,
          enabled: true,
        },
        orderBy: [
          {
            page: "asc",
          },
          {
            action: "asc",
          },
        ],
      });

    res.status(200).json({
      success: true,
      message: "User permissions updated successfully",
      data: {
        user,
        pagePermissions: updatedPagePermissions,
        actionPermissions: updatedActionPermissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * DELETE USER
 * =========================================================
 *
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(userId)) {
      const error = new Error("Invalid user ID");

      error.statusCode = 400;
      throw error;
    }

    // Prevent deleting yourself
    if (req.user && req.user.userId === userId) {
      const error = new Error(
        "You cannot delete your own account"
      );

      error.statusCode = 400;
      throw error;
    }

    // Check user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");

      error.statusCode = 404;
      throw error;
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * EXPORTS
 * =========================================================
 */

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  getUserPermissions,
  updateUserPermissions,
  deleteUser,
};
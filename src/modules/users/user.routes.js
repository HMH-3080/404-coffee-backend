const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    getUsers,
    createUser,
    updateUser,
    updateUserStatus,
    getUserPermissions,
    updateUserPermissions,
    deleteUser,
} = require("./user.controller");

const router = express.Router();


// =========================================================
// USERS PAGE
// =========================================================

// Get all users
router.get(
    "/",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "view_users"),
    getUsers,
);


// Create new user
router.post(
    "/",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "create_user"),
    createUser,
);


// Update user
router.put(
    "/:id",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "edit_user"),
    updateUser,
);


// Update user status
router.patch(
    "/:id/status",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "change_user_status"),
    updateUserStatus,
);


// Delete user
router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "delete_user"),
    deleteUser,
);


// =========================================================
// USER PERMISSIONS
// =========================================================

// Get user permissions
router.get(
    "/:id/permissions",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "manage_permissions"),
    getUserPermissions,
);


// Update user permissions
router.put(
    "/:id/permissions",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "manage_permissions"),
    updateUserPermissions,
);


module.exports = router;

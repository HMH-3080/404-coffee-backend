const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
  requirePagePermission,
  requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    getUserPermissions,
} = require("./permission.controller");

const router = express.Router();

router.get(
    "/users/:id",
    authMiddleware,
    requirePagePermission("users"),
    requireActionPermission("users", "manage_permissions"),
    getUserPermissions
);

module.exports = router;
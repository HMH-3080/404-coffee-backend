const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    getUserPermissions,
} = require("./permission.controller");

const router = express.Router();

router.get(
    "/users/:id",
    authMiddleware,
    getUserPermissions
);

module.exports = router;

const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
} = require("../../middlewares/permission.middleware");

const {
    createSale,
} = require("./sale.controller");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    requirePagePermission("sales"),
    createSale
);

module.exports = router;
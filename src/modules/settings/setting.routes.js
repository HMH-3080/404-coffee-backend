const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
    requireActionPermission,
} = require("../../middlewares/permission.middleware");

const {
    getSettings,
    updateSetting,
    updateSettingsBulk,
} = require("./setting.controller");

const router = express.Router();

const PAGE = "settings";

// ============================================================
// Get all settings
// ============================================================

router.get(
    "/",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "view_settings"),
    getSettings
);

// ============================================================
// Update multiple settings
// ============================================================

router.post(
    "/bulk",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "update_settings"),
    updateSettingsBulk
);

// ============================================================
// Update single setting
// ============================================================

router.put(
    "/:key",
    authMiddleware,
    requirePagePermission(PAGE),
    requireActionPermission(PAGE, "update_settings"),
    updateSetting
);

module.exports = router;

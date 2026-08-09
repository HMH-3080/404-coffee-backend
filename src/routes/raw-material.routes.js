const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");

const {
  requirePagePermission,
} = require("../middlewares/permission.middleware");

const {
  getRawMaterials,
  createRawMaterial,
  updateRawMaterial,
} = require("../controllers/raw-material.controller");

const router = express.Router();

// Get all raw materials
router.get(
  "/",
  authMiddleware,
  requirePagePermission("inventory"),
  getRawMaterials,
);

// Create raw material
router.post(
  "/",
  authMiddleware,
  requirePagePermission("inventory"),
  createRawMaterial,
);

// Update raw material
router.put(
  "/:id",
  authMiddleware,
  requirePagePermission("inventory"),
  updateRawMaterial,
);

module.exports = router;

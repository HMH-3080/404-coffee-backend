const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
  requirePagePermission,
} = require("../../middlewares/permission.middleware");

const {
    getRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    addBatch,
    getMaterialBatches,
} = require("./raw-material.controller");
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

router.get(
    "/:id/batches",
    authMiddleware,
    requirePagePermission("inventory"),
    getMaterialBatches
);

router.post(
    "/:id/batches",
    authMiddleware,
    requirePagePermission("inventory"),
    addBatch
);

// Update raw material
router.put(
  "/:id",
  authMiddleware,
  requirePagePermission("inventory"),
  updateRawMaterial,
);


// Delete raw material
router.delete(
  "/:id",
  authMiddleware,
  requirePagePermission("inventory"),
  deleteRawMaterial,
);


module.exports = router;

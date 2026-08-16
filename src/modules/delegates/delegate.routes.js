const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    requirePagePermission,
} = require("../../middlewares/permission.middleware");

const {
    getDelegates,
    getDelegateById,
    createDelegate,
    updateDelegate,
    updateDelegateStatus,
    deleteDelegate,
} = require("./delegate.controller");

const router = express.Router();


// Get all delegates
router.get(
    "/",
    authMiddleware,
    requirePagePermission("delegates"),
    getDelegates,
);


// Get delegate by ID
router.get(
    "/:id",
    authMiddleware,
    requirePagePermission("delegates"),
    getDelegateById,
);


// Create delegate
router.post(
    "/",
    authMiddleware,
    requirePagePermission("delegates"),
    createDelegate,
);


// Update delegate
router.put(
    "/:id",
    authMiddleware,
    requirePagePermission("delegates"),
    updateDelegate,
);


// Update delegate status
router.patch(
    "/:id/status",
    authMiddleware,
    requirePagePermission("delegates"),
    updateDelegateStatus,
);


// Delete delegate
router.delete(
    "/:id",
    authMiddleware,
    requirePagePermission("delegates"),
    deleteDelegate,
);


module.exports = router;
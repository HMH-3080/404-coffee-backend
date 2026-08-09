/**
 * routes/user.routes.js  — تحديث: إضافة route لتعديل مستخدم
 * =================================================================
 * الهدف: إضافة رابط PUT جديد لتعديل بيانات مستخدم موجود، جنب GET و POST السابقين.
 * 
 * تفاصيل:
 * 1) router.put("/:id", authMiddleware, updateUser)
 *    → PUT /api/users/5 → لازم تسجيل دخول الأول، وبعدين ينفذ updateUser 
 *      اللي بياخد الـ id من req.params.id
 * 
 * 2) نفس الملاحظة المتكررة: لسه مفيش requireActionPermission("users", "edit") 
 *    → يعني أي مستخدم مسجل دخول يقدر يعدل بيانات أي مستخدم تاني (حتى الأدمن نفسه) دلوقتي.
 *    محتاج يتقفل بصلاحية قبل ما يوصل للعميل بشكل نهائي.
 */
const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const {
    getUsers,
    createUser,
    updateUser,
    updateUserStatus,
    getUserPermissions,
    updateUserPermissions,
    deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

// Get user permissions
router.get("/:id/permissions", authMiddleware, getUserPermissions);

// Update user permissions
router.put("/:id/permissions", authMiddleware, updateUserPermissions);

// Get all users
router.get("/", authMiddleware, getUsers);


// Create new user
router.post("/", authMiddleware, createUser);


// Update user
router.put("/:id", authMiddleware, updateUser);


// Update user status
router.patch("/:id/status", authMiddleware, updateUserStatus);

router.delete(
    "/:id",
    authMiddleware,
    deleteUser
);


module.exports = router;
/**
 * middleware/permissions.js
 * ==========================
 * الهدف: التحكم في مين يقدر يشوف صفحة معينة أو يعمل فعل معين (زي حذف/تعديل) في النظام.
 * 
 * فيه دالتين:
 * 1) requirePagePermission(page) 
 *    → تتأكد إن المستخدم أصلاً عنده صلاحية "يشوف" الصفحة دي (مثلاً: يدخل صفحة الموردين)
 * 
 * 2) requireActionPermission(page, action)
 *    → تتأكد إن المستخدم عنده صلاحية يعمل "فعل" محدد جوا الصفحة دي (مثلاً: يحذف مورد تحديدًا)
 * 
 * الاتنين بيشتغلوا كـ middleware يعني بيتحطوا في الـ route قبل الـ controller،
 * ولو المستخدم مش مسجل دخول يرجع 401، ولو مسجل بس مالوش صلاحية يرجع 403.
 * لو كل حاجة تمام، بينده next() ويسيب الـ request يكمل للـ controller.
 * 
 * مرتبط بجداول: UserPagePermission و UserActionPermission في schema.prisma
 */


const prisma = require("../lib/prisma");

// Check if the authenticated user has access to a page
const requirePagePermission = (page) => {
    return async (req, res, next) => {
        try {
            // User must be authenticated first
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const userId = req.user.userId;

            const permission = await prisma.userPagePermission.findUnique({
                where: {
                    userId_page: {
                        userId,
                        page,
                    },
                },
            });

            if (!permission || !permission.enabled) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this page",
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Check if the authenticated user has permission to perform an action
const requireActionPermission = (page, action) => {
    return async (req, res, next) => {
        try {
            // User must be authenticated first
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const userId = req.user.userId;

            const permission = await prisma.userActionPermission.findUnique({
                where: {
                    userId_page_action: {
                        userId,
                        page,
                        action,
                    },
                },
            });

            if (!permission || !permission.enabled) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to perform this action",
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    requirePagePermission,
    requireActionPermission,
};
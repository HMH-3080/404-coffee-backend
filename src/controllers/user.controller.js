/**
 * controllers/user.controller.js  — إضافة دالة إنشاء مستخدم جديد (createUser)
 * ================================================================================
 * الهدف: إنشاء موظف/مستخدم جديد في النظام مع كلمة سر مشفّرة.
 * 
 * خطوات createUser بالترتيب:
 * 1) يتحقق إن (الاسم + الباسورد + المنصب) موجودين كلهم في الـ body، 
 *    لو حاجة ناقصة يرمي خطأ بكود 400 (طلب غير صحيح)
 * 
 * 2) يدور هل فيه مستخدم بنفس الاسم موجود قبل كده،
 *    لو لاقى واحد يرمي خطأ بكود 409 (تعارض/Conflict - يعني "الحاجة دي موجودة أصلاً")
 * 
 * 3) يشفّر الباسورد بـ bcrypt قبل ما يخزنه (زي ما عملنا في seed.js)
 * 
 * 4) ينشئ المستخدم، وبيستخدم "select" تاني عشان الـ response يرجع من غير passwordHash 
 *    (نفس مبدأ الأمان اللي شفناه في getUsers)
 * 
 * ملاحظة على أسلوب الأخطاء الجديد هنا:
 *    error.statusCode = 400  →  بيحط كود الخطأ كخاصية على الـ error object نفسه،
 *    بعدين next(error) يودّيه للـ errorHandler المركزي اللي (المفروض) يقرأ statusCode ده 
 *    ويرجعه في الـ response بدل ما يكون 500 ثابت لكل الأخطاء
 */

const bcrypt = require("bcryptjs");

const prisma = require("../lib/prisma");


// Get all users
const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};


// Create new user
const createUser = async (req, res, next) => {
    try {
        const { name, password, position } = req.body;

        // Validate required fields
        if (!name || !password || !position) {
            const error = new Error(
                "Name, password and position are required"
            );

            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                name,
            },
        });

        if (existingUser) {
            const error = new Error("User already exists");

            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                passwordHash,
                position,
                status: "ACTIVE",
            },
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};


/**
 * controllers/user.controller.js  — تحديث: إضافة دالة تعديل مستخدم (updateUser)
 * ==================================================================================
 * الهدف: تعديل بيانات مستخدم موجود (الاسم/المنصب/الباسورد)، مع السماح بتعديل جزء بس من البيانات.
 * 
 * خطوات updateUser بالترتيب:
 * 1) Number(req.params.id) → يحول الـ id من الـ URL (نص) لرقم، 
 *    و Number.isInteger() يتأكد إنه رقم صحيح فعلاً، لو مش كده يرمي خطأ 400
 * 
 * 2) يدور على المستخدم بالـ id ده، لو مش موجود يرمي خطأ 404 (مش موجود)
 * 
 * 3) "Prepare update data" — بيبني object فاضي (updateData) ويضيف فيه بس الحقول 
 *    اللي فعلاً اتبعتت في الـ request (يعني لو بعتت الاسم بس من غير باسورد، 
 *    هيعدل الاسم بس ومش هيلمس باقي البيانات)
 *    → ده اسمه "Partial Update" وهو أفضل من إنك تجبر المستخدم يبعت كل الحقول كل مرة
 * 
 * 4) الباسورد بيتحدث بس لو اتبعت وملوش قيمة فاضية ("")، وبيتشفر تاني بـ bcrypt 
 *    قبل ما يتحط في updateData - لو مبعتش أصلاً، الباسورد القديم فاضل زي ما هو
 * 
 * 5) select في الآخر بيرجع البيانات من غير passwordHash (نفس مبدأ الأمان المتكرر)
 */

// Update user
const updateUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);

        const { name, password, position } = req.body;

        // Validate ID
        if (!Number.isInteger(userId)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Prepare update data
        const updateData = {};

        if (name !== undefined) {
            updateData.name = name;
        }

        if (position !== undefined) {
            updateData.position = position;
        }

        // Update password only if provided
        if (password !== undefined && password !== "") {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        // Update user
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * controllers/user.controller.js  — تحديث: إضافة دالة تفعيل/تعطيل مستخدم (updateUserStatus)
 * =====================================================================================
 * الهدف: تفعيل أو تعطيل مستخدم من غير حذفه أو تعديل بياناته (زي زرار ▶️/تفعيل اللي شفناه 
 * في جداول التصميم بتاعتنا - نفس المبدأ بالظبط اللي طبقناه في "is_active" للموردين).
 * 
 * خطوات updateUserStatus بالترتيب:
 * 1) يتحقق إن الـ id رقم صحيح (400 لو غلط)
 * 
 * 2) يتحقق إن القيمة المبعوتة في "status" واحدة بس من اتنين مسموحين: 
 *    "ACTIVE" أو "SUSPENDED" (مطابقة لقيم enum UserStatus في schema.prisma)
 *    → لو بعتت أي قيمة تانية غيرهم، يرمي 400
 * 
 * 3) يتأكد المستخدم موجود أصلاً (404 لو مش موجود)
 * 
 * 4) يحدث عمود status بس، ويرجع البيانات من غير passwordHash
 */
// Update user status
const updateUserStatus = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const { status } = req.body;

        // Validate ID
        if (!Number.isInteger(userId)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        // Validate status
        if (!["ACTIVE", "SUSPENDED"].includes(status)) {
            const error = new Error(
                "Status must be ACTIVE or SUSPENDED"
            );

            error.statusCode = 400;
            throw error;
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Update status
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                status,
            },
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json({
            success: true,
            message: `User status updated to ${status}`,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * controllers/user.controller.js  — تحديث: إضافة دالة عرض صلاحيات مستخدم (getUserPermissions)
 * ==========================================================================================
 * الهدف: يرجع كل صلاحيات مستخدم معين في مكان واحد (بيانات المستخدم + صلاحيات الصفحات 
 * + صلاحيات الأفعال) - ده هيتستخدم في شاشة "الموظفين والصلاحيات" عشان تعرض للأدمن 
 * إيه بالظبط اللي الموظف ده يقدر يعمله.
 * 
 * خطوات getUserPermissions بالترتيب:
 * 1) يتحقق إن الـ id رقم صحيح (400 لو غلط)
 * 
 * 2) يجيب بيانات المستخدم الأساسية (بدون passwordHash) ويتأكد إنه موجود (404 لو مش موجود)
 * 
 * 3) يجيب كل صفوف "userPagePermission" الخاصة باليوزر ده (كل الصفحات المسموح/الممنوع دخولها)
 * 
 * 4) يجيب كل صفوف "userActionPermission" الخاصة باليوزر ده (كل الأفعال المسموح/الممنوعة)
 *    → مرتبة بالصفحة الأول وبعدين بالفعل، عشان تظهر منظمة في الواجهة (مجمعة حسب كل صفحة)
 * 
 * 5) يرجع الثلاثة مع بعض في response واحد: { user, pagePermissions, actionPermissions }
 *    → كده الفرونت إند مش محتاج يعمل 3 requests منفصلة، طلب واحد كفاية لبناء شاشة الصلاحيات كاملة
 */

// Get user permissions
const getUserPermissions = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);

        // Validate ID
        if (!Number.isInteger(userId)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
            },
        });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Get page permissions
        const pagePermissions =
            await prisma.userPagePermission.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    page: true,
                    enabled: true,
                },
                orderBy: {
                    page: "asc",
                },
            });

        // Get action permissions
        const actionPermissions =
            await prisma.userActionPermission.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    page: true,
                    action: true,
                    enabled: true,
                },
                orderBy: [
                    {
                        page: "asc",
                    },
                    {
                        action: "asc",
                    },
                ],
            });

        res.status(200).json({
            success: true,
            data: {
                user,
                pagePermissions,
                actionPermissions,
            },
        });
    } catch (error) {
        next(error);
    }
};



// Update user permissions
const updateUserPermissions = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);

        const {
            pagePermissions = [],
            actionPermissions = [],
        } = req.body;

        // Validate user ID
        if (!Number.isInteger(userId)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
            },
        });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Validate permissions arrays
        if (
            !Array.isArray(pagePermissions) ||
            !Array.isArray(actionPermissions)
        ) {
            const error = new Error(
                "pagePermissions and actionPermissions must be arrays"
            );

            error.statusCode = 400;
            throw error;
        }

        // Validate page permissions
        for (const permission of pagePermissions) {
            if (
                !permission.page ||
                typeof permission.enabled !== "boolean"
            ) {
                const error = new Error(
                    "Each page permission must contain page and boolean enabled"
                );

                error.statusCode = 400;
                throw error;
            }
        }

        // Validate action permissions
        for (const permission of actionPermissions) {
            if (
                !permission.page ||
                !permission.action ||
                typeof permission.enabled !== "boolean"
            ) {
                const error = new Error(
                    "Each action permission must contain page, action and boolean enabled"
                );

                error.statusCode = 400;
                throw error;
            }
        }

        // Update page permissions
        for (const permission of pagePermissions) {
            await prisma.userPagePermission.upsert({
                where: {
                    userId_page: {
                        userId,
                        page: permission.page,
                    },
                },
                update: {
                    enabled: permission.enabled,
                },
                create: {
                    userId,
                    page: permission.page,
                    enabled: permission.enabled,
                },
            });
        }

        // Update action permissions
        for (const permission of actionPermissions) {
            await prisma.userActionPermission.upsert({
                where: {
                    userId_page_action: {
                        userId,
                        page: permission.page,
                        action: permission.action,
                    },
                },
                update: {
                    enabled: permission.enabled,
                },
                create: {
                    userId,
                    page: permission.page,
                    action: permission.action,
                    enabled: permission.enabled,
                },
            });
        }

        // Get updated permissions
        const updatedPagePermissions =
            await prisma.userPagePermission.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    page: true,
                    enabled: true,
                },
                orderBy: {
                    page: "asc",
                },
            });

        const updatedActionPermissions =
            await prisma.userActionPermission.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    page: true,
                    action: true,
                    enabled: true,
                },
                orderBy: [
                    {
                        page: "asc",
                    },
                    {
                        action: "asc",
                    },
                ],
            });

        res.status(200).json({
            success: true,
            message: "User permissions updated successfully",
            data: {
                user,
                pagePermissions: updatedPagePermissions,
                actionPermissions: updatedActionPermissions,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Delete user
const deleteUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);

        // Validate ID
        if (!Number.isInteger(userId)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        // Prevent deleting yourself
        if (req.user.userId === userId) {
            const error = new Error("You cannot delete your own account");
            error.statusCode = 400;
            throw error;
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                position: true,
                status: true,
            },
        });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Delete user
        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getUsers,
    createUser,
    updateUser,
    updateUserStatus,
    getUserPermissions,
    updateUserPermissions,
    deleteUser,
};
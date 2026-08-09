/**
 * prisma/seedPermissions.js  — سكريبت تلقائي لإعطاء المستخدم "Admin" كل الصلاحيات
 * ========================================================================
 * الهدف: بدل ما تدخل يدوي في الداتابيز وتضيف صلاحية صلاحية، السكريبت ده بيشغلها كلها دفعة واحدة.
 * 
 * بيعمل حاجتين:
 * 1) يدور على مستخدم اسمه "Admin"، ولو مش لاقيه يوقف بخطأ واضح.
 * 2) يمشي على كل صفحة في ليستة `pages` ويديله صلاحية دخولها (enabled: true).
 * 3) يمشي كمان على كل فعل في ليستة `salesActions` ويديله صلاحية يعملهم جوا صفحة "sales" بس.
 * 
 * "upsert" = كلمة مدمجة من (Update + Insert):
 *    - لو الصلاحية دي موجودة قبل كده لنفس اليوزر → يعمل تحديث (update)
 *    - لو مش موجودة أصلاً → ينشئها من جديد (create)
 *    → ده مفيد عشان تقدر تشغل السكريبت أكتر من مرة من غير ما يحصل خطأ "already exists"
 * 
 * يتشغل مرة واحدة بس عادة (بعد أول إنشاء للـ Admin) بالأمر:
 *   node prisma/seedPermissions.js
 */

require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/lib/prisma");




const pages = [
    "sales",
    "products",
    "inventory",
    "orders",
    "returns",
    "cash_drawer_shifts",
    "financial_reports",
    "audit_log",
    "settings",
];

const salesActions = [
    "view_products",
    "create_invoice",
    "edit_invoice",
    "cancel_invoice",
    "print_invoice",
    "apply_discount",
    "sales_returns",
    "view_sales_history",
    "export_invoices",
    "view_reports",
];

const seedPermissions = async () => {
    // Find Admin user
    const admin = await prisma.user.findFirst({
        where: {
            name: "Admin",
        },
    });

    if (!admin) {
        throw new Error("Admin user not found");
    }

    console.log(`Seeding permissions for: ${admin.name}`);

    // Create / update page permissions
    for (const page of pages) {
        await prisma.userPagePermission.upsert({
            where: {
                userId_page: {
                    userId: admin.id,
                    page,
                },
            },
            update: {
                enabled: true,
            },
            create: {
                userId: admin.id,
                page,
                enabled: true,
            },
        });
    }

    // Create / update sales action permissions
    for (const action of salesActions) {
        await prisma.userActionPermission.upsert({
            where: {
                userId_page_action: {
                    userId: admin.id,
                    page: "sales",
                    action,
                },
            },
            update: {
                enabled: true,
            },
            create: {
                userId: admin.id,
                page: "sales",
                action,
                enabled: true,
            },
        });
    }

    console.log("Admin page permissions created successfully.");
    console.log("Admin sales action permissions created successfully.");
};

seedPermissions()
    .catch((error) => {
        console.error("Seed permissions failed:", error);
        process.exit(1);
    });
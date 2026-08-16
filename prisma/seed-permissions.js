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
    "dashboard",
    "users",
    "sales",
    "products",
    "customers",
    "suppliers",
    "delegates",
    "inventory",
    "warnings",
    "orders",
    "returns",
    "purchases",
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

const cashDrawerActions = [
    "open_shift",
    "close_shift",
    "record_cash_in",
    "record_cash_out",
    "view_shifts_report",
];

const usersActions = [
    "view_users",
    "create_user",
    "edit_user",
    "change_user_status",
    "delete_user",
    "manage_permissions",
];

const financialReportActions = [
    "view_sales_report",
    "view_profit_report",
    "view_treasury_report",
];

const auditLogActions = [
    "view_audit_log",
];

const settingsActions = [
    "view_settings",
    "update_settings",
];

const warningsActions = [
    "view_warnings",
];

const returnsActions = [
    "view_returns",
    "create_return",
    "edit_return",
    "approve_return",
    "cancel_return",
    "delete_return",
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

    // Create / update action permissions
    const actionGroups = [
        { page: "sales", actions: salesActions },
        { page: "cash_drawer_shifts", actions: cashDrawerActions },
        { page: "users", actions: usersActions },
        { page: "financial_reports", actions: financialReportActions },
        { page: "audit_log", actions: auditLogActions },
        { page: "settings", actions: settingsActions },
        { page: "warnings", actions: warningsActions },
        { page: "returns", actions: returnsActions },
    ];

    for (const group of actionGroups) {
        for (const action of group.actions) {
            await prisma.userActionPermission.upsert({
                where: {
                    userId_page_action: {
                        userId: admin.id,
                        page: group.page,
                        action,
                    },
                },
                update: {
                    enabled: true,
                },
                create: {
                    userId: admin.id,
                    page: group.page,
                    action,
                    enabled: true,
                },
            });
        }
    }

    console.log("Admin page permissions created successfully.");
    console.log("Admin action permissions created successfully.");
};

seedPermissions()
    .catch((error) => {
        console.error("Seed permissions failed:", error);
        process.exit(1);
    });
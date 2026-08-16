# 404 Coffee — ملخص المشروع والحالة الحالية

> آخر تحديث: 16 أغسطس 2026
> الهدف من الملف: ملخص سريع للمشروع، اللي خلص، اللي فاضل، ومدى التقدم.

---

## 1) نظرة عامة

- **نظام إدارة كافيه** (نظام إدارة المقاهي والإنتاج) بواجهة عربية RTL.
- **Backend**: Node.js + Express 5 + Prisma 7 + PostgreSQL (المسار: `~/Desktop/404-coffee-backend`).
- **Frontend**: React + Vite SPA منشور على https://404-project-2.vercel.app/ (React Router hash-based, axios, lucide-react, TanStack Query-style).
- **Architecture backend**: `routes → controllers → services → prisma` مع صلاحيات على مستوى الصفحة والفعل.

---

## 2) الـ Backend — الوضع الحالي

### موديولز موجودة (مكتملة CRUD + صلاحيات)
| الموديول | المسار | الحالة |
|---|---|---|
| Auth / Users | `/api/auth`, `/api/users` | ✅ مكتمل |
| Permissions | `/api/permissions` | ✅ مكتمل |
| Raw Materials + Batches | `/api/raw-materials` | ✅ مكتمل |
| Products (Types/Sizes/Addons/Ingredients) | `/api/products` | ✅ مكتمل |
| Customers | `/api/customers` | ✅ مكتمل |
| Suppliers | `/api/suppliers` | ✅ مكتمل |
| Purchases (Draft/Approve/Cancel) | `/api/purchases` | ✅ مكتمل |
| Sales | `/api/sales` | ✅ مكتمل |
| Orders (Dine-in/Takeaway/Online) | `/api/orders` | ✅ مكتمل |
| Returns | `/api/returns` | ✅ مكتمل |
| Delegates | `/api/delegates` | ✅ مكتمل |
| Cash Drawer / Shifts | `/api/cash-drawer-shifts` | ✅ مكتمل |
| Financial Reports | `/api/financial-reports` | ✅ مكتمل |
| Audit Log | `/api/audit-logs` | ✅ مكتمل |
| Settings | `/api/settings` | ✅ مكتمل |
| Warnings (مخزون منخفض/صلاحية) | `/api/warnings` | ✅ مكتمل |
| Dashboard | `/api/dashboard` | ✅ مكتمل (ملخص: مبيعات/طلبات/وردية/تنبيهات/إحصائيات) |
| AI Chat (OpenAI) | `/api/chat` | ✅ مكتمل (function calling: عام + بيانات الموظفين) — يحتاج `OPENAI_API_KEY` |
| الحضور | تسجيل الدخول | ✅ تسجيل دخول الموظف (`POST /api/auth/login`) يُسجَّل تلقائيًا في سجل الأحداث (`auth` / `login`) — لا يوجد نظام حضور بأجهزة/QR/بصمة |

### صفحات الصلاحيات في `permissions.config.js` + `seed-permissions.js`
`dashboard, users, sales, products, customers, suppliers, delegates, inventory, warnings, orders, returns, purchases, cash_drawer_shifts, financial_reports, audit_log, settings`
> ✅ تم إصلاح مشكلة الصفحات الناقصة (suppliers/customers/delegates/users/warnings/purchases/dashboard).

### تنظيف تم (أغسطس 2026)
- نُقل Auth من البنية القديمة `src/routes|controllers|services` إلى `src/modules/auth/`.
- حُذفت ملفات ميتة/فارغة: `test.routes/controller`, `user.service.js` (غير مستخدم), `database.js`, `password.js`, `validate.middleware.js`, مجلد `validators/` الفارغ.
- حُذفت مجلدات فارغة مضللة: `src/modules/{inventory,recipes,reports}`.
- حُذفت نسخ احتياطية متروكة: `*.backup` + `src_backup_before_users_restructure/`.
- أُصلح `GET /api/permissions/users/:id` (دالة غير موجودة) وتم ربط صلاحيات الـ returns/purchases وorders في الـ seed.

---

## 3) الـ Frontend — الوضع الحالي

**المهم: الفرونت حالياً شبهه Prototype بالكامل.** كل الصفحات بتعرض بيانات mock hardcoded، وعدد الـ API calls الحقيقيين = **واحد بس** (`POST /api/inventory/materials`). مفيش ربط فعلي مع الباكند بعد.

### صفحات الـ sidebar (11 صفحة)
| الصفحة | المسار | الحالة في الفرونت |
|---|---|---|
| لوحة التحكم (Dashboard) | `/admin/dashboard` | ⚠️ Stub (h1 بس) |
| المخزون (Inventory) | `/admin/inventory` | ✅ UI موجود + 1 API call |
| التحذيرات (Warnings) | `/admin/warnings` | ✅ UI (بيانات mock) |
| الموردون (Suppliers) | `/admin/suppliers` | ✅ UI (mock) |
| المشتريات / فواتير التوريد | `/admin/invoices` + `/admin/purchases` | ✅ UI (mock) |
| المنتجات (Products) | `/admin/products` | ✅ UI (mock) |
| المبيعات (POS) | `/admin/sales` | ✅ UI (mock) |
| الطلبات (Orders) | `/admin/orders` | ✅ UI (mock) |
| المرتجعات (Returns) | `/admin/returns` | ✅ UI (mock) |
| الدرج والورديات (Drawer) | `/admin/drawer` | ✅ UI (mock) |
| الموظفين والصلاحيات | `/admin/employees` | ✅ UI (mock) |

### حاجات مفيشها صفحة أصلاً في الفرونت (بالرغم من وجود أيقونات/صلاحيات)
- **العملاء (Customers)** — أيقونة موجودة لكن مفيش route/صفحة.
- **التقارير (Reports / financial_reports)** — صلاحية موجودة لكن مفيش صفحة.
- **سجل الأحداث (Audit Log / logs)** — صلاحية موجودة لكن مفيش صفحة.
- **الإعدادات (Settings)** — صلاحية موجودة لكن مفيش صفحة.
- **Login/تسجيل دخول** — مفيش صفحة login ولا flow مرتبط (في بس interceptor للتوكن + mock بيانات غير مستخدم).

---

## 4) المقارنة Backend ↔ Frontend (الفجوات)

| الموديول | Backend | Frontend | ملاحظات |
|---|---|---|---|
| Auth/Users | ✅ | ❌ | مفيش صفحة login حتى |
| Sales (POS) | ✅ | UI فقط | محتاج ربط |
| Products | ✅ | UI فقط | محتاج ربط |
| Inventory (Raw Materials) | ✅ | UI فقط | الـ call الوحيد لـ create material |
| Orders | ✅ | UI فقط | محتاج ربط |
| Returns | ✅ | UI فقط | محتاج ربط |
| Suppliers | ✅ | UI فقط | محتاج ربط |
| Purchases | ✅ | UI فقط | محتاج ربط |
| Customers | ✅ | ❌ | باكند جاهز، فرونت مفيش صفحة |
| Delegates | ✅ | جزئي | مذكور في assign للطلبات |
| Cash Drawer / Shifts | ✅ | UI فقط | محتاج ربط |
| Financial Reports | ✅ | ❌ | باكند جاهز، فرونت مفيش صفحة |
| Audit Log | ✅ | ❌ | باكند جاهز، فرونت مفيش صفحة |
| Settings | ✅ | ❌ | باكند جاهز، فرونت مفيش صفحة |
| Warnings | ✅ | UI فقط | باكند جاهز، محتاج ربط |
| Dashboard | ✅ | Stub | الـ endpoint جاهز (`/api/dashboard`)، الفرونت محتاج ربط |

---

## 5) اللي خلص ✅

1. **Backend شبه كامل**: الـ schema (كل الجداول الأساسية) + الـ Services + الـ Routes + نظام الصلاحيات + Auth + Error Handling.
2. **Frontend UI**: لوحة تحكم كاملة الشكل (11 صفحة) بكل الموديولز الأساسية (POS، منتجات، مخزون، موردون، مشتريات، طلبات، مرتجعات، درج وورديات، موظفين وصلاحيات) — كواجهة.

## 6) اللي فاضل 🔴

### Backend
- ✅ **الـ Backend مكتمل بالكامل** — كل الموديولز جاهزة (بما فيها الحضور/أداء الموظفين الذي كان ناقصًا).

### Frontend
1. صفحة **Login** وربطها بالـ auth الحقيقي.
2. صفحات **Customers**, **Reports**, **Settings**, **Audit Log**.
3. **الربط الكامل** بين كل الصفحات والـ API (استبدال mock data بـ axios calls) — ده أكبر شغل فاضل.
4. استكمال **Dashboard** الفعلي (الـ endpoint جاهز).

---

## 7) تقدير نسبة الإنجاز

| الجزء | النسبة |
|---|---|
| Backend (API + DB + صلاحيات) | ~100% (كل الموديولز جاهزة) |
| Frontend (واجهة UI فقط) | ~70% |
| الربط (Frontend ↔ Backend) | ~5% |
| **المشروع ككل** | **~55-60%** |

> الخلاصة: **الباكند خلص بالكامل (كل الموديولز + الدرج والورديات + التقارير + السجل + الإعدادات + التنبيهات + Dashboard + الحضور/الأداء + صلاحيات لكل صفحة)**. الفجوة الأكبر فاضلة هي **ربط الفرونت بالباكند** (~5%)، وبعدها صفحات الفرونت الناقصة (Login, Customers, Reports, Settings, Audit).

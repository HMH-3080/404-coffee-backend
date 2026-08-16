# 404 Coffee Backend — API Reference

توثيق **فعلي** لكل الـ endpoints الموجودة في الكود (تم جردها من ملفات الـ routes مباشرة).

- Base URL: `http://localhost:5000`
- كل الـ endpoints (عدا `login` و `health`) تتطلب هيدر:
  ```
  Authorization: Bearer <JWT>
  ```
- نظام الصلاحيات: `authMiddleware` ثم `requirePagePermission(page)` ثم `requireActionPermission(page, action)`.
- الاستجابة الخطأ القياسية: `{ success: false, message: "..." }`.
- جدول ملخص في نهاية الملف.

---

## Auth

### POST `/api/auth/login`
تسجيل دخول (عام — بدون توكن).

Body:
```json
{ "email": "admin@404coffee.com", "password": "..." }
```

Response:
```json
{ "success": true, "token": "<JWT>", "user": { ... } }
```

---

## Users — `/api/users`

| Method | Endpoint | Action | ملاحظات |
|---|---|---|---|
| GET | `/api/users` | `view_users` | قائمة المستخدمين مع صلاحياتهم |
| POST | `/api/users` | `create_user` | إنشاء مستخدم |
| PUT | `/api/users/:id` | `edit_user` | تعديل مستخدم — يدعم `fingerprintId` لربط بصمة الموظف (`""` يمسحها) |
| PATCH | `/api/users/:id/status` | `change_user_status` | تفعيل/تعطيل |
| DELETE | `/api/users/:id` | `delete_user` | حذف |
| GET | `/api/users/:id/permissions` | `manage_permissions` | جلب صلاحيات مستخدم |
| PUT | `/api/users/:id/permissions` | `manage_permissions` | تحديث صلاحيات مستخدم |

---

## Permissions — `/api/permissions`

| Method | Endpoint | Auth | ملاحظات |
|---|---|---|---|
| GET | `/api/permissions/users/:id` | auth فقط | ✓ تم الإصلاح — يرجع صلاحيات المستخدم الكاملة |

---

## Sales — `/api/sales`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/sales` | `view_sales_history` |
| GET | `/api/sales/:id` | `view_sales_history` |
| POST | `/api/sales` | `create_invoice` |
| PUT | `/api/sales/:id` | `edit_invoice` |
| DELETE | `/api/sales/:id` | `cancel_invoice` |

---

## Purchases — `/api/purchases`

| Method | Endpoint | ملاحظات |
|---|---|---|
| GET | `/api/purchases` | صفحة `purchases` (أُضيفت للـ seed) |
| GET | `/api/purchases/:id` | نفس الصفحة |
| POST | `/api/purchases` | نفس الصفحة |
| PUT | `/api/purchases/:id` | نفس الصفحة |
| PATCH | `/api/purchases/:id/approve` | نفس الصفحة |
| PATCH | `/api/purchases/:id/cancel` | نفس الصفحة |
| DELETE | `/api/purchases/:id` | نفس الصفحة |

---

## Customers — `/api/customers`

| Method | Endpoint | ملاحظات |
|---|---|---|
| GET | `/api/customers` | صفحة `customers` |
| GET | `/api/customers/:id` | صفحة `customers` |
| POST | `/api/customers` | `validateCustomer` |
| PUT | `/api/customers/:id` | صفحة `customers` |
| DELETE | `/api/customers/:id` | صفحة `customers` |

---

## Raw Materials (Inventory) — `/api/raw-materials`

| Method | Endpoint | ملاحظات |
|---|---|---|
| GET | `/api/raw-materials` | صفحة `inventory` |
| POST | `/api/raw-materials` | صفحة `inventory` |
| GET | `/api/raw-materials/:id/batches` | صفحة `inventory` |
| POST | `/api/raw-materials/:id/batches` | صفحة `inventory` — إضافة دفعة |
| PUT | `/api/raw-materials/:id` | صفحة `inventory` |
| DELETE | `/api/raw-materials/:id` | صفحة `inventory` |

> ملاحظة: الفرونت يستدعي `POST /api/inventory/materials` — هذا الـ endpoint **غير موجود** في الـ backend (المسار الصحيح `/api/raw-materials`).

---

## Suppliers — `/api/suppliers`

| Method | Endpoint | ملاحظات |
|---|---|---|
| GET | `/api/suppliers` | صفحة `suppliers` |
| GET | `/api/suppliers/:id` | صفحة `suppliers` |
| POST | `/api/suppliers` | صفحة `suppliers` |
| PUT | `/api/suppliers/:id` | صفحة `suppliers` |
| DELETE | `/api/suppliers/:id` | صفحة `suppliers` |

---

## Products — `/api/products`

| Method | Endpoint | ملاحظات |
|---|---|---|
| GET | `/api/products` | صفحة `products` |
| GET | `/api/products/by-barcode/:code` | صفحة `products` — مسح باركود في الـ POS وجلب المنتج فورًا |
| GET | `/api/products/:id` | صفحة `products` |
| POST | `/api/products` | صفحة `products` |
| GET | `/api/products/:productId/sizes` | صفحة `products` |
| POST | `/api/products/:productId/sizes` | صفحة `products` |
| POST | `/api/products/:productId/sizes/:sizeId/ingredients` | صفحة `products` — إضافة مكوّن لحجم |
| GET | `/api/products/:productId/types` | صفحة `products` — أنواع المشروب |
| POST | `/api/products/:productId/types` | صفحة `products` — إنشاء نوع |
| PUT | `/api/products/:productId/types/:typeId` | صفحة `products` |
| DELETE | `/api/products/:productId/types/:typeId` | صفحة `products` |
| POST | `/api/products/:productId/types/:typeId/ingredients/:rawMaterialId` | صفحة `products` — إضافة مكوّن لنوع |
| DELETE | `/api/products/:productId/types/:typeId/ingredients/:rawMaterialId` | صفحة `products` — إزالة مكوّن من نوع |
| GET | `/api/products/:productId/addons` | صفحة `products` — الإضافات |
| POST | `/api/products/:productId/addons` | صفحة `products` — إنشاء إضافة |
| PUT | `/api/products/:productId/addons/:addonId` | صفحة `products` |
| DELETE | `/api/products/:productId/addons/:addonId` | صفحة `products` |
| PUT | `/api/products/:id` | صفحة `products` |
| DELETE | `/api/products/:id` | صفحة `products` |

**حقل الباركود**: `POST /api/products` و `PUT /api/products/:id` يقبلان `barcode` (اختياري، فريد — تكراره يعطي 409، وإرسال `""` يمسحه).

---

## Returns — `/api/returns`

| Method | Endpoint | Action | ملاحظات |
|---|---|---|---|
| GET | `/api/returns` | `view_returns` | ✓ مُمنوحة في الـ seed |
| POST | `/api/returns` | `create_return` | ✓ |
| PATCH | `/api/returns/:id/approve` | `approve_return` | ✓ |
| PATCH | `/api/returns/:id/cancel` | `cancel_return` | ✓ |
| GET | `/api/returns/:id` | `view_returns` | ✓ |
| PUT | `/api/returns/:id` | `edit_return` | ✓ |
| DELETE | `/api/returns/:id` | `delete_return` | ✓ |

---

## Delegates — `/api/delegates`

| Method | Endpoint | ملاحظات |
|---|---|---|
| GET | `/api/delegates` | صفحة `delegates` |
| GET | `/api/delegates/:id` | صفحة `delegates` |
| POST | `/api/delegates` | صفحة `delegates` |
| PUT | `/api/delegates/:id` | صفحة `delegates` |
| PATCH | `/api/delegates/:id/status` | صفحة `delegates` — تفعيل/تعطيل |
| DELETE | `/api/delegates/:id` | صفحة `delegates` |

---

## Orders — `/api/orders`

| Method | Endpoint | ملاحظات |
|---|---|---|
| POST | `/api/orders` | صفحة `orders` |
| GET | `/api/orders` | صفحة `orders` |
| GET | `/api/orders/:id` | صفحة `orders` |
| PUT | `/api/orders/:id` | `validateOrder` |
| DELETE | `/api/orders/:id` | صفحة `orders` |

> ملاحظة: لا يوجد endpoint مخصص لتحديث حالة الطلب أو إسناد مندوب (PUT يغطي بعض ذلك جزئيًا عبر تحديث جزئي).

---

## Cash Drawer Shifts — `/api/cash-drawer-shifts`

الصفحة: `cash_drawer_shifts`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/cash-drawer-shifts` | `view_shifts_report` |
| GET | `/api/cash-drawer-shifts/current` | `view_shifts_report` |
| GET | `/api/cash-drawer-shifts/:id` | `view_shifts_report` |
| POST | `/api/cash-drawer-shifts` | `open_shift` |
| POST | `/api/cash-drawer-shifts/:id/close` | `close_shift` |
| POST | `/api/cash-drawer-shifts/:id/cash-in` | `record_cash_in` |
| POST | `/api/cash-drawer-shifts/:id/cash-out` | `record_cash_out` |

---

## Audit Logs — `/api/audit-logs`

الصفحة: `audit_log`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/audit-logs` | `view_audit_log` |
| GET | `/api/audit-logs/:id` | `view_audit_log` |

---

## Settings — `/api/settings`

الصفحة: `settings`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/settings` | `view_settings` |
| POST | `/api/settings/bulk` | `update_settings` |
| PUT | `/api/settings/:key` | `update_settings` |

---

## Warnings — `/api/warnings`

الصفحة: `warnings`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/warnings` | `view_warnings` |

---

## Financial Reports — `/api/financial-reports`

الصفحة: `financial_reports`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/financial-reports/sales` | `view_sales_report` |
| GET | `/api/financial-reports/profit` | `view_profit_report` |
| GET | `/api/financial-reports/treasury` | `view_treasury_report` |

---

## Dashboard — `/api/dashboard`

الصفحة: `dashboard`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/dashboard` | صفحة `dashboard` |

يرجع ملخص: مبيعات اليوم/الإجمالي، طلبات اليوم/الإجمالي، الطلبات المعلقة، الوردية المفتوحة (رصيد/داخل/خارج)، إحصائيات (منتجات/عملاء/موردين/مناديب)، تنبيهات المخزون (low stock + قرب الانتهاء).

---

## Attendance / Employee Performance — `/api/attendance`

الصفحة: `attendance`

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/attendance` | `view_attendance` — فلاتر: `userId`, `status`, `from`, `to` |
| GET | `/api/attendance/summary` | `view_attendance` — فلاتر: `userId`, `from`, `to` |
| POST | `/api/attendance/check-in` | `check_in` — body: `notes?` |
| POST | `/api/attendance/check-out` | `check_out` |
| POST | `/api/attendance/fingerprint` | **عام (بدون JWT)** — body: `{ "fingerprintId": "..." }` — البصمة نفسها هي الهوية؛ أول مسح = check-in والثاني = check-out |

- الحضور: سجل واحد لكل موظف في اليوم (`@@unique([userId, date])`)، check-in/check-out يمنع التكرار (409).
- كل سجل يحمل `method` (`MANUAL` أو `FINGERPRINT`).
- **ربط البصمة**: `PUT /api/users/:id` بـ `{ "fingerprintId": "..." }` (فريد — تكراره 409، و`""` يمسحه)؛ يُظهره `GET /api/users`.
- ملخص الأداء: عدد أيام الحضور، إجمالي/متوسط ساعات العمل، عدد/نسبة التأخير (بداية الوردية من إعداد `shift_start` — الافتراضي `10:00`).

---

## AI Chat — `/api/chat`

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/chat` | اختياري (عام للعملاء) |

Body:
```json
{ "messages": [{ "role": "user", "content": "ما هي المنتجات المتاحة؟" }] }
```

- **عام**: أي زائر يرسل — رد عام + معلومات المنيو (المنتجات فقط).
- **موظف/مدير**: لو مررتَ `Authorization: Bearer <JWT>` صالحًا في الهيدر، تُفعّل أدوات بيانات كاملة (مخزون منخفض، ملخص مبيعات، حالات الطلبات، ملخص اللوحة).
- الآلية: **OpenAI Function Calling** — البوت ينفّذ أدوات فعلية على الداتابيز ثم يرد بالنص.
- مطلوب إعداد `OPENAI_API_KEY` (واختياري `OPENAI_MODEL`، الافتراضي `gpt-4o-mini`) في `.env`.

---

## Health

### GET `/api/health`
عام (بدون توكن).
```json
{ "success": true, "message": "404 Coffee API is running" }
```

---

## ملخص سريع

| الموديول | المسار | عدد الـ endpoints | الحالة |
|---|---|---|---|
| Auth | `/api/auth` | 1 | ✓ |
| Users | `/api/users` | 7 | ✓ |
| Permissions | `/api/permissions` | 1 | ✓ |
| Sales | `/api/sales` | 5 | ✓ |
| Purchases | `/api/purchases` | 7 | ✓ |
| Customers | `/api/customers` | 5 | ✓ |
| Raw Materials | `/api/raw-materials` | 6 | ✓ |
| Suppliers | `/api/suppliers` | 5 | ✓ |
| Products | `/api/products` | 18 | ✓ |
| Returns | `/api/returns` | 7 | ✓ |
| Delegates | `/api/delegates` | 6 | ✓ |
| Orders | `/api/orders` | 5 | ✓ |
| Cash Drawer | `/api/cash-drawer-shifts` | 7 | ✓ |
| Audit Logs | `/api/audit-logs` | 2 | ✓ |
| Settings | `/api/settings` | 3 | ✓ |
| Warnings | `/api/warnings` | 1 | ✓ |
| Financial Reports | `/api/financial-reports` | 3 | ✓ |
| Dashboard | `/api/dashboard` | 1 | ✓ |
| Attendance | `/api/attendance` | 5 | ✓ (بما فيها تسجيل البصمة العام) |
| AI Chat | `/api/chat` | 1 | ✓ (يحتاج `OPENAI_API_KEY`) |
| Health | `/api/health` | 1 | ✓ |

> **97 endpoint** إجماليًا، كلها موثقة أعلاه. `src/modules/auth/` هي موضع موديول تسجيل الدخول (نُقل من البنية القديمة `src/routes|controllers|services`).
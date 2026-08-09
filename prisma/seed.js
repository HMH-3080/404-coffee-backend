
/**
 * prisma/seed.js  — إنشاء أول مستخدم "Admin" في النظام
 * =========================================================
 * الهدف: إنشاء يوزر أدمن افتراضي عشان تقدر تسجل دخول أول مرة قبل ما يبقى عندك نظام تسجيل كامل.
 * 
 * الخطوات:
 * 1) bcrypt.hash("root123", 10) 
 *    → بيشفّر كلمة السر "root123" (متتخزنش أبدًا كنص عادي في الداتابيز - ده مبدأ أمان أساسي)
 *    → الرقم "10" ده "قوة التشفير" (salt rounds) - كل ما زاد الرقم زاد الأمان لكن زاد الوقت المستغرق
 * 
 * 2) prisma.user.create(...) 
 *    → ينشئ صف جديد في جدول users بالبيانات دي (الاسم، الباسورد المشفر، المنصب، الحالة)
 * 
 * 3) $disconnect() في النهاية 
 *    → يقفل الاتصال بالداتابيز بعد ما السكريبت يخلص شغله (مهم في السكريبتات المستقلة زي دي، 
 *      عكس السيرفر العادي اللي بيفضل الاتصال شغال طول الوقت)
 * 
 * يتشغل مرة واحدة بس بالأمر: node prisma/seed.js
 */

require("dotenv").config();

const bcrypt = require("bcryptjs");

const prisma = require("../src/lib/prisma");

async function main() {
  const passwordHash = await bcrypt.hash("root123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Admin",
      passwordHash,
      position: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Seed user created:", user.name);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
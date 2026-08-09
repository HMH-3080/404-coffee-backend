/**
 * services/raw-material.service.js  — منطق المواد الخام (Service Layer)
 * ================================================================================
 * الهدف: يحتوي على منطق التعامل مع جدول rawMaterial (جلب الكل + إنشاء واحدة جديدة)،
 * بعيدًا عن الـ Controller (نفس نمط الـ Service الموجود في المستخدمين تقريبًا).
 * 
 * getRawMaterials: يجيب كل المواد الخام مرتبة من الأحدث للأقدم.
 * 
 * createRawMaterial: 
 * 1) يتحقق إن كل الحقول المطلوبة موجودة (name, unit, quantity, pricePerUnit, 
 *    supplier, minStockAlert) - لو حاجة ناقصة يرمي 400
 * 2) يتحقق إن مفيش مادة خام بنفس الاسم موجودة قبل كده - لو موجودة يرمي 409
 * 3) ينشئ المادة، وبيحول التواريخ (addedAt, expiryDate) لصيغة Date، 
 *    ولو مبعتتش تاريخ إضافة يستخدم الوقت الحالي تلقائي
 */
const prisma = require("../lib/prisma");

// Get all raw materials
const getRawMaterials = async () => {
    const rawMaterials = await prisma.rawMaterial.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return rawMaterials;
};

// Create raw material
const createRawMaterial = async ({
    name,
    unit,
    quantity,
    pricePerUnit,
    supplier,
    addedAt,
    expiryDate,
    minStockAlert,
    expiryAlertDays,
}) => {

    // Check required fields
    if (
        !name ||
        !unit ||
        quantity === undefined ||
        pricePerUnit === undefined ||
        !supplier ||
        minStockAlert === undefined
    ) {
        const error = new Error("Required raw material data is missing");
        error.statusCode = 400;
        throw error;
    }

    // Check if raw material already exists
    const existingMaterial = await prisma.rawMaterial.findUnique({
        where: {
            name,
        },
    });

    if (existingMaterial) {
        const error = new Error("Raw material already exists");
        error.statusCode = 409;
        throw error;
    }

    const rawMaterial = await prisma.rawMaterial.create({
        data: {
            name,
            unit,
            quantity,
            pricePerUnit,
            supplier,
            addedAt: addedAt ? new Date(addedAt) : new Date(),
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            minStockAlert,
            expiryAlertDays:
                expiryAlertDays !== undefined
                    ? expiryAlertDays
                    : null,
        },
    });

    return rawMaterial;
};

// Update raw material
const updateRawMaterial = async (id, data) => {
    const existingMaterial = await prisma.rawMaterial.findUnique({
        where: {
            id: Number(id),
        },
    });

    if (!existingMaterial) {
        const error = new Error("Raw material not found");
        error.statusCode = 404;
        throw error;
    }

    const {
        name,
        unit,
        quantity,
        pricePerUnit,
        supplier,
        addedAt,
        expiryDate,
        minStockAlert,
        expiryAlertDays,
    } = data;

    const updatedMaterial = await prisma.rawMaterial.update({
        where: {
            id: Number(id),
        },
        data: {
            ...(name !== undefined && { name }),
            ...(unit !== undefined && { unit }),
            ...(quantity !== undefined && { quantity }),
            ...(pricePerUnit !== undefined && { pricePerUnit }),
            ...(supplier !== undefined && { supplier }),
            ...(addedAt !== undefined && {
                addedAt: new Date(addedAt),
            }),
            ...(expiryDate !== undefined && {
                expiryDate: expiryDate ? new Date(expiryDate) : null,
            }),
            ...(minStockAlert !== undefined && {
                minStockAlert,
            }),
            ...(expiryAlertDays !== undefined && {
                expiryAlertDays,
            }),
        },
    });

    return updatedMaterial;
};

module.exports = {
    getRawMaterials,
    createRawMaterial,
    updateRawMaterial,
};
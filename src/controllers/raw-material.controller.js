/**
 * controllers/raw-material.controller.js  — Controller المواد الخام
 * ================================================================================
 * الهدف: طبقة HTTP رفيعة (thin controller) - بتستقبل الـ request، بتنده الـ service 
 * المناسب، وبترجع الـ response. نفس نمط user.controller.js بالظبط.
 * 
 * getRawMaterials: يرجع كل المواد الخام (من غير pagination لسه - نفس الملاحظة اللي 
 * قلتها قبل كده على الـ service).
 * 
 * createRawMaterial: بياخد بيانات المادة من req.body ويبعتها زي ما هي لـ service، 
 * ويرجع 201 لو نجح.
 */

const rawMaterialService = require("../services/raw-material.service");

// Get all raw materials
const getRawMaterials = async (req, res, next) => {
    try {
        const rawMaterials = await rawMaterialService.getRawMaterials();

        res.status(200).json({
            success: true,
            data: rawMaterials,
        });

    } catch (error) {
        next(error);
    }
};

// Create raw material
const createRawMaterial = async (req, res, next) => {
    try {
        const rawMaterial = await rawMaterialService.createRawMaterial(req.body);

        res.status(201).json({
            success: true,
            message: "Raw material created successfully",
            data: rawMaterial,
        });

    } catch (error) {
        next(error);
    }
};

// Update raw material
const updateRawMaterial = async (req, res, next) => {
    try {
        const rawMaterial = await rawMaterialService.updateRawMaterial(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Raw material updated successfully",
            data: rawMaterial,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getRawMaterials,
    createRawMaterial,
    updateRawMaterial,
};
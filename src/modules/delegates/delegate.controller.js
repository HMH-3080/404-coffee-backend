const delegateService = require("./delegate.service");

// Get all delegates
const getDelegates = async (req, res, next) => {
    try {
        const delegates = await delegateService.getDelegates();

        res.status(200).json({
            success: true,
            data: delegates,
        });
    } catch (error) {
        next(error);
    }
};


// Get delegate by ID
const getDelegateById = async (req, res, next) => {
    try {
        const delegate = await delegateService.getDelegateById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: delegate,
        });
    } catch (error) {
        next(error);
    }
};


// Create delegate
const createDelegate = async (req, res, next) => {
    try {
        const delegate = await delegateService.createDelegate(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Delegate created successfully",
            data: delegate,
        });
    } catch (error) {
        next(error);
    }
};


// Update delegate
const updateDelegate = async (req, res, next) => {
    try {
        const delegate = await delegateService.updateDelegate(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Delegate updated successfully",
            data: delegate,
        });
    } catch (error) {
        next(error);
    }
};


// Update delegate status
const updateDelegateStatus = async (req, res, next) => {
    try {
        const delegate = await delegateService.updateDelegateStatus(
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            message: "Delegate status updated successfully",
            data: delegate,
        });
    } catch (error) {
        next(error);
    }
};


// Delete delegate
const deleteDelegate = async (req, res, next) => {
    try {
        const delegate = await delegateService.deleteDelegate(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Delegate deleted successfully",
            data: delegate,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getDelegates,
    getDelegateById,
    createDelegate,
    updateDelegate,
    updateDelegateStatus,
    deleteDelegate,
};
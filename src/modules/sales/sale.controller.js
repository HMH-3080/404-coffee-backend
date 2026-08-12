const saleService = require("./sale.service");

const createSale = async (req, res, next) => {
    try {
        const sale = await saleService.createSale(req.body);

        res.status(201).json({
            success: true,
            message: "Sale created successfully",
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSale,
};
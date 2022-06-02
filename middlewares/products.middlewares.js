//Models
const { Product } = require('../models/products.model');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');


const productExists = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findOne({
        where: { id, status: 'active' },
    });

    if (!product) {
        return next(new AppError('Product does not exist whith given Id', 404));
    };

    req.product = product;
    next();
});

const validateAssociatedProduct = catchAsync(async (req, res, next) => {
    const { product, sessionUser } = req;

    if (sessionUser.id != product.userId) {
        return next(new AppError('The product is not associated with the user ', 400));
    };
 
    next();
});

module.exports = {
    productExists,
    validateAssociatedProduct,
}
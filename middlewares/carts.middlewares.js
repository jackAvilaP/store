//Models
const { Carts } = require('../models/carts.model');
const { Product } = require('../models/products.model');

const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');


const cartExists = catchAsync(async (req, res, next) => {

    const { sessionUser } = req;

    const newCart = await Carts.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    });

    if (!newCart) {
        const newCart = await Carts.create({
            userId: sessionUser.id,
        });
        return req.newCart = newCart;
    };

    req.newCart = newCart;
    next();
});

/*const searchCartInProducts = catchAsync(async (req, res, next) => {

    const { sessionUser } = req;

    const existsCartInProduct = await Carts.findAll({
        where: { userId: sessionUser.id },
        include: [
            {
                model: ProductsInCart,
                where: { productId },
            }
        ]
    });

    if (existsCartInProduct) {
        return next(new AppError('This product is already added', 404));
    };

    req.existsCartInProduct = existsCartInProduct;
    next();
});*/


module.exports = {
    cartExists,
    
}
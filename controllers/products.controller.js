//Models
const { Product } = require('../models/products.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');


const createProducts = catchAsync(async (req, res, next) => {

    const { sessionUser } = req;

    const { title, description, price, quantity, status,categoryId } = req.body;

    /*const product = await Product.findOne({
        where: { id: mealId },
    });
    if (!product) {
        return next(new AppError('order does not exist with given mealId', 404));
    }*/
    const newProduct = await Product.create({
        title,
        description,
        price,
        quantity,
        status,
        categoryId,
        userId: sessionUser.id,
    });

    res.status(201).json({ newProduct });
});

const productsAll = catchAsync(async (req, res, next) => {
  
    const products = await Product.findAll();
    res.status(200).json({ products });
});

const productById = catchAsync(async (req, res, next) => {

    const { product } = req;

    res.status(200).json({ product });
});

const updateProductById = catchAsync(async (req, res, next) => {
    const { product } = req;
    const { title, description, price, quantity } = req.body;


    const productUpdate = await product.update({
        title,
        description,
        price,
        quantity
    });

    res.status(200).json({ productUpdate, status: 'success' })
});

const deleteProductById = catchAsync(async (req, res, next) => {
    const { product } = req;

    const productDelete = await product.update({ status: 'disable' });

    res.status(200).json({ productDelete, status: 'success' })

});

module.exports = {
    createProducts,
    productsAll,
    productById,
    updateProductById,
    deleteProductById,
}
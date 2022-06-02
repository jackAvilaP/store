const express = require('express');

//Middlewares
const { protectToken } = require('../middlewares/users.middlewares');

//Controller
const {
    productsAll,
    productById,
    deleteProductById,
    createProducts,
    updateProductById,
} = require('../controllers/products.controller');

const {
    getAllCategories,
    createCategories,
    updateCategories,
} = require('../controllers/categories.controller');

const { productExists, validateAssociatedProduct } = require('../middlewares/products.middlewares');
const { createProductValidations, checkValidations } = require('../middlewares/validations.middlewares');


const router = express.Router();

router.get('/', productsAll);

router.get('/categories', getAllCategories);

router.get('/:id', productExists, productById);

router.use(protectToken);

router.post('/', createProductValidations, checkValidations, createProducts);


router.post('/categories', createCategories);

router
    .route('/:id')
    .patch(productExists, validateAssociatedProduct, updateProductById)
    .delete(productExists, validateAssociatedProduct, deleteProductById);

router.patch('/categories/:id', updateCategories);

module.exports = { productsRouter: router };  
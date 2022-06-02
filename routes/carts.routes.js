const express = require('express');

const {
    addProductCart,
    getAllCart,
    purchaseCart,
    removeProductCart,
    updateCart
} = require('../controllers/carts.controller');

const { cartExists } = require('../middlewares/carts.middlewares');
const { protectToken } = require('../middlewares/users.middlewares');

const router = express.Router();

router.use(protectToken);

router.get('/', getAllCart);

router.post('/add-product', addProductCart);
router.patch('/update-cart', updateCart);
router.post('/purchase', purchaseCart);
router.delete('/:productId', removeProductCart);

module.exports = { cartsRouter: router };
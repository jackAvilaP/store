//Models
const { Carts } = require('../models/carts.model');
const { Orders } = require('../models/orders.model');
const { Product } = require('../models/products.model');
const { ProductsInCart } = require('../models/productsInCart.model');


const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');


const addProductCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const { sessionUser } = req;

    // Validating that the product has enough stock for the cart
    const product = await Product.findOne({ where: { id: productId, status: 'active'} });

    if (!product) {
        return next(new AppError('Invalid product', 404));
    } else if (quantity < 0 || quantity > product.quantity) {
        return next(
            new AppError(
                `This product only has ${product.quantity} items available`,
                400
            )
        );
    }

    // Finding a current active cart, if it doesn't exist, we'll create a new one
    const cart = await Carts.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    });

    // Creating a new cart if it doesn't exist
    if (!cart) {
        const newCart = await Carts.create({ userId: sessionUser.id });

        // Adding a product to the cart
        await ProductsInCart.create({ cartId: newCart.id, productId, quantity });
    } else {
        // In this point i know that the user already has a cart
        // Validating if product already exists in the cart
        const productInCart = await ProductsInCart.findOne({
            where: { cartId: cart.id, productId },
        });

        // Sending an error if it exists
        if (productInCart && productInCart.status === 'active') {
            return next(
                new AppError('You already have that product in your cart', 400)
            );
             
        }else if(productInCart && productInCart.status === 'remove') {
            //Reactivate the product and quantity, add the cart .
            await productInCart.update({ status: 'active', quantity });

        } else{
            //add new product in the cart with your Id.
            await ProductsInCart.create({ cartId: cart.id, productId, quantity });
        }

    }

    res.status(200).json({ status: 'success', cart});
});

const getAllCart = catchAsync(async (req, res, next) => {

    const { sessionUser } = req;

    //Pasarlo a middlewares
    const allCartUser = await Carts.findAll({
        where: { userId: sessionUser.id, status: 'active' },
        include:
            [
                {
                    model: ProductsInCart, 
                    include: [
                        { model: Product, }
                    ]
                }
            ]
    });

    res.status(200).json({ allCartUser });
});


const updateCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { newQty, productId } = req.body;

    const cart = await Carts.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    });

    if (!cart) {
        return next(new AppError('Must create a cart first', 400));
    }

    const productInCart = await ProductsInCart.findOne({
        where: { status: 'active', cartId: cart.id, productId },
        include: [{ model: Product }],
    });

    if (!productInCart) {
        return next(new AppError('This product does not exist in your cart', 404));
    };


    if (newQty < 0 || newQty > productInCart.product.quantity) {
        return next(
            new AppError(
                `Invalid selected quantity, this product only has ${productsInCart.product.quantity} items available`,
                400
            )
        );
    }

    if (newQty === 0) {
        await productInCart.update({ quantity: 0, status: 'removed' })
    } else if (newQty > 0) {
        // Update product in cart to new qty
        await productInCart.update({ quantity: newQty });
    }

    res.status(200).json({ status: 'success', productInCart });
});

const purchaseCart = catchAsync(async (req, res, next) => {

    const { sessionUser } = req;

    //Get user cart
    const cart = await Carts.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    });

    if(!cart){
        return next(new AppError('this user does not have a cart yet', 400))
    };

    //Get producInCart
    const productInCart = await ProductsInCart.findAll({
        where: { status: 'active', cartId: cart.id},
        include: [{ model: Product }],
    });
    let totalPrice = 0;
    //Lopp product in cart map async
    const cartsPromises = productInCart.map(async productCart => {
       const resQuantity = productCart.product.quantity - productCart.quantity;
       
       await productCart.product.update({ quantity: resQuantity, })
       
       //Calculate total price
      const productPrice = productCart.quantity * parseInt( productCart.product.price); 
      totalPrice += productPrice;

      return await productCart.update({ status: 'purchased' });
    });

    //resolver promises all
    await Promise.all(cartsPromises);
    
    //substract stock
    /*const quantityProduct = await Product.findOne({
        where: { status: 'active', id: productInCart.productId},
    });
    const resQuantity =  quantityProduct.quantity - productInCart.quantity;
    const totalPriceCart = quantityProduct.price*productInCart.quantity;
    
    await quantityProduct.update({
        quantity: resQuantity,
    });*/


   //create oders user 
  const order = await Orders.create({
        userId:sessionUser.id,
        cartId:cart.id,
        totalPrice: totalPrice,
        status:'purchased'
    });
    
    await cart.update({ status: 'purchased' });

    res.status(200).json({ status: 'success', order });
});

const removeProductCart = catchAsync(async (req, res, next) => {
    //const { productInCart } = req;
    const { sessionUser } = req;

    const cart = await Carts.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    });

    const productInCart = await ProductsInCart.findOne({
        where: { status: 'active', cartId: cart.id},
        include: [{ model: Product }],
    });

    await productInCart.update({ status: 'removed' });
    await cart.update({ status: 'removed' });

    res.status(200).json({ status: 'success' });
});

module.exports = {
    addProductCart,
    getAllCart,
    updateCart,
    purchaseCart,
    removeProductCart,
};
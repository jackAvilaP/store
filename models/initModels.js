const { Product } = require('../models/products.model');
const { User } = require('../models/user.model');
const { Orders } = require('../models/orders.model');
const { Carts } = require('../models/carts.model');
const { ProductsInCart } = require('../models/productsInCart.model');
const { ProductImg } = require('../models/productImg.model');
const { Categories } = require('./categories.model');
// Establish your models relations inside this function
const initModels = () => {

    User.hasMany(Product);
    Product.belongsTo(User);

    User.hasMany(Orders);
    Orders.belongsTo(User);

    User.hasOne(Carts);
    Carts.belongsTo(User);

    Carts.hasOne(Orders);
    Orders.belongsTo(Carts);

    Carts.hasMany(ProductsInCart);
    ProductsInCart.belongsTo(Carts);

    Categories.hasOne(Product);
    Product.belongsTo(Categories);

    Product.hasOne(ProductsInCart);
    ProductsInCart.belongsTo(Product);

    Product.hasMany(ProductImg);
    ProductImg.belongsTo(Product);
};

module.exports = { initModels };

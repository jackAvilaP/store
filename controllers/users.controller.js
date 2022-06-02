const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// require('crypto').randomBytes(64).toString('hex')

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/products.model');
const { Orders } = require('../models/orders.model');
const { Carts } = require('../models/carts.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

const getAllUserProducts = catchAsync(async (req, res, next) => {

  const { sessionUser } = req;

  const userProducts = await User.findAll({
    include:
      [
        {
          model: Product,
          where: { userId: sessionUser.id }
        }
      ]
  });

  res.status(200).json({
    userProducts,
  });
});

const getUserOrdersById = catchAsync(async (req, res, next) => { 

});


const getAllOrdersUser = catchAsync(async (req, res, next) => {

  const { sessionUser } = req;

  const userOrders = await User.findAll({
    include:
      [
        {
          model: Orders,
          where: { userId: sessionUser.id },

        },

      ],
    iclude:
      [
        {
          model: Carts,
          where: { userId: sessionUser.id }
        }
      ]
  });

  res.status(200).json({
    userOrders,
  });
});


const createUser = catchAsync(async (req, res, next) => {

  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  // INSERT INTO ...
  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
  });
  newUser.password = undefined;

  res.status(201).json({ newUser });

});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { username, email } = req.body;

  const userUpdate = await user.update({ username, email });

  res.status(200).json({ userUpdate, status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const userDelete = await user.update({ status: 'deleted' });

  res.status(200).json({
    userDelete,
    status: 'success',
  });
});

const login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;

  //validate that user
  const user = await User.findOne({ where: { email, status: 'active' } });

  //Compate password with db 
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  //Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
  getAllUserProducts,
  getAllOrdersUser,
  getUserOrdersById,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  checkToken,
};

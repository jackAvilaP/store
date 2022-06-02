const express = require('express');

// Middlewares
const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');

// Controller
const {
  getAllUserProducts,
  getAllOrdersUser,
  getUserOrdersById,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  checkToken,
} = require('../controllers/users.controller');
const { createUserValidations, checkValidations } = require('../middlewares/validations.middlewares');

const router = express.Router();

router.post('/', createUserValidations, checkValidations, createUser);

router.post('/login', login);

// Apply protectToken middleware
router.use(protectToken);

router.get('/me', getAllUserProducts);

router.get('/check-token', checkToken);

router.get('/orders', getAllOrdersUser);
router.get('/orders/:id', getUserOrdersById);
router
  .route('/:id')
  .get(userExists, getUserById)
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };

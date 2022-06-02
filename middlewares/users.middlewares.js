const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectToken = catchAsync(async (req, res, next) => {
  let token;
  //token son eviados por headers extraer el token desde mi api (extract token from header)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    //['Bearer','token']
    token = req.headers.authorization.split(' ')[1];
  };

  if (!token) {
    return next(new AppError('session invalid', 403));
  };

  //validate token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  //{id:1, iat: 123213xx, exp:123456xxx }
  const user = await User.findOne({ where: { id: decoded.id, status: 'active' } });

  if (!user) {
    return next(new AppError('The owner of this token is no longer available', 403))
  };

  //identificador de usuarion en sesion actual
  req.sessionUser = user;
  next();
});

const protectAdmin = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== 'admin') {
    return next(new AppError('Access not granted', 403));
  }

  next();
});

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'active' },
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    return next(new AppError('User does not exist with given Id', 404));
  }

  // Add user data to the req object
  req.user = user;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  // Get current session user and the user that is going to be updated
  const { sessionUser, user } = req;

  // Compare the id's
  if (sessionUser.id !== user.id) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  // If the ids are equal, the request pass
  next();
});

module.exports = {
  userExists,
  protectToken,
  protectAdmin,
  protectAccountOwner,
};

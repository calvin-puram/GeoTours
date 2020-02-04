const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const sendToken = (user, res, statusCode) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  res.status(statusCode).json({
    success: true,
    token,
    data: user
  });
};

//@desc   Register Users
//@route  Get api/v1/users/signup
//@access public
exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    photo,
    passwordConfirm,
    passwordChangeAt
  } = req.body;

  const user = await Users.create({
    name,
    email,
    password,
    photo,
    passwordConfirm,
    passwordChangeAt
  });

  sendToken(user, res, 201);
});

//@desc   login Users
//@route  Get api/v1/users/login
//@access public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('email and password are required', 400));
  }

  const user = await Users.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError(`Invalid credential`, 401));
  }

  sendToken(user, res, 201);
});

//@desc   protect route
//@route  middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not logged in', 401));
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user exist
  const currentUser = await Users.findById(decode.id).select('+password');

  if (!currentUser) {
    return next(new AppError('user no longer exist', 401));
  }

  if (currentUser.checkpassword(decode.iat)) {
    return next(
      new AppError('this user recently changed his password. login again', 401)
    );
  }

  req.user = currentUser;

  //authorize user
  next();
});

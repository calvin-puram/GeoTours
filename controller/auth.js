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
  const { name, email, password, photo, passwordConfirm } = req.body;

  const user = await Users.create({
    name,
    email,
    password,
    photo,
    passwordConfirm
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

const jwt = require('jsonwebtoken');

const Users = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const sendToken = (users, res, statusCode) => {
  const token = jwt.sign({ id: users.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  res.status(statusCode).json({
    success: true,
    token,
    data: users
  });
};

//@desc   Register Users
//@route  Get api/v1/users/signup
//@access public
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, photo, passwordConfirm } = req.body;

  const users = await Users.create({
    name,
    email,
    password,
    photo,
    passwordConfirm
  });

  sendToken(users, res, 201);
});

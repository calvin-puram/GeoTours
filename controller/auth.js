const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const sendToken = (user, res, statusCode) => {
  const token = user.sendJWT();

  user.password = undefined;
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
    passwordChangeAt,
    role,
    passwordResetExpires,
    passwordResetToken
  } = req.body;

  const user = await Users.create({
    name,
    email,
    password,
    photo,
    passwordConfirm,
    passwordChangeAt,
    role,
    passwordResetExpires,
    passwordResetToken
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

//@desc     logout Users / clear token
//@route    Get api/v1/users/logout
//@access   private
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

//@desc   protect route
//@route  middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.body) {
    // eslint-disable-next-line prefer-destructuring
    token = req.body;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: 'you are not logged in'
    });
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user exist
  const currentUser = await Users.findById(decode.id);

  if (!currentUser) {
    return res.status(401).json({
      success: false,
      msg: 'user no longer exist'
    });
  }

  if (currentUser.checkpassword(decode.iat)) {
    return res.status(401).json({
      success: false,
      msg: 'this user recently changed his password. login again'
    });
  }

  req.user = currentUser;

  //authorize user
  next();
});

//@desc  user role access
//@route middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorize to perform this action', 401)
      );
    }
    next();
  };
};

//@desc   Forgot Password
//@route  POST api/v1/users/forgotPassword
//@access public
exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('email field is required', 400));
  }

  const user = await Users.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('this email is not registered', 401));
  }

  const resetToken = user.forgotPasswordToken();
  await user.save({ validateBeforeSave: false });

  const reply = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetToken/${resetToken}`;

  const message = `You recently requested for a password reset. You can submit a PATCH request to this URL \n ${reply}. If you don't know anything about this please ignore`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token <expires in 10mins time',
      message
    });

    res.status(200).json({
      success: true,
      msg: 'your password reset token has been sent to your email'
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('your reset token could not be sent. Please try again', 500)
    );
  }
});

//@desc   reset Password
//@route  PATCH api/v1/users/resetPassword
//@access public
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid Credentials', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendToken(user, res, 200);
});

//@desc   update Password
//@route  PATCH api/v1/users/updatePassword
//@access private
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('all fields are required', 400));
  }

  const user = await Users.findById(req.user.id).select('+password');

  if (!user || !(await user.comparePassword(currentPassword, user.password))) {
    return next(new AppError('Invalid Credentials', 401));
  }

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  sendToken(user, res, 200);
});

const chalk = require('chalk');
const AppError = require('../utils/appError');

//send error in development
const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    stack: error.stack,
    msg: error.message
  });
};

// send error in production
const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      msg: error.message
    });
  } else {
    //something unexpected happens
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'something unexpected occur. please try again later'
    });
  }
};

// handle cast error
const handleCastError = error => {
  const message = `this ${error.path}: ${error.value} is not valid`;
  return new AppError(message, 400);
}

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastError(error);

    sendErrorProd(error, res);
  }
};
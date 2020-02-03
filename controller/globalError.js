const chalk = require('chalk');

module.exports = (err, req, res, next) => {
  const errorDev = error => {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      msg: error.message
    });
  };

  const errorProd = error => {
    res.status(error.statusCode).json({
      status: error.status,
      msg: error.message
    });
  };

  const error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  error.stack = err.stack;

  if (error.isOperational) {
    if (process.env.NODE_ENV === 'development') {
      errorDev(error);
    } else if (process.env.NODE_ENV === 'production') {
      errorProd(error);
      
    }
  } else {
    // eslint-disable-next-line prefer-template
    console.log(error);
    res.status(500).json({
      status: 'fail',
      msg: 'something unexpected happens. Try later'
    });
  }
};

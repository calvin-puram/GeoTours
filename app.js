const express = require('express');
const morgan = require('morgan');

const toursRoutes = require('./routes/toursRoute');
const usersRoutes = require('./routes/usersRoute');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

module.exports = app;

const express = require('express');
const morgan = require('morgan');

const toursRoutes = require('./routes/tours');
const usersRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/users', usersRoutes);

module.exports = app;

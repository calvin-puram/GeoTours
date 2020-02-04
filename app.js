const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const toursRoutes = require('./routes/tours');
const usersRoutes = require('./routes/users');
const globalError = require('./controller/globalError');

const app = express();

//helmet
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}
app.use((req, res, next) => {
  console.log(req.cookies.jwt);
  next();
});

app.use(hpp());
app.use(mongoSanitize());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

//rate limit
app.use('/api/', limiter);
app.use(xss());

app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/users', usersRoutes);
app.use(globalError);

module.exports = app;

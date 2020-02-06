const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const toursRoutes = require('./routes/tours');
const usersRoutes = require('./routes/users');
const globalError = require('./controller/globalError');
const reviewsRoute = require('./routes/reviews');

const app = express();

//helmet
app.use(helmet());
app.use(cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

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
app.use('/api/v1/reviews', reviewsRoute);
app.use(globalError);

module.exports = app;

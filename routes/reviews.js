const express = require('express');

const router = express.Router({ mergeParams: true });

const reviewController = require('../controller/reviews');
const auth = require('../controller/auth');

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    auth.protect,
    auth.restrictTo('user', 'admin'),
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getOneReviews)
  .patch(
    auth.protect,
    auth.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    auth.protect,
    auth.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;

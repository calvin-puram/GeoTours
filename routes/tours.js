const express = require('express');

const router = express.Router();

const toursController = require('../controller/tours');

router
  .route('/')
  .get(toursController.getTours)
  .post(toursController.createTours);

router
  .route('/:id')
  .get(toursController.getOneTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTours);

module.exports = router;

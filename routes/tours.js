const express = require('express');

const router = express.Router();

const toursController = require('../controller/tours');
const auth = require('../controller/auth');

//top5cheap
router.get('/top5cheap', toursController.top5cheap, toursController.getTours);
//tour stat
router.get('/tourstat', toursController.getTourStats);
router.get('/monthly-plan/:year', toursController.getTourMonthlyPlan);

router
  .route('/')
  .get(auth.protect, toursController.getTours)
  .post(toursController.createTours);

router
  .route('/:id')
  .get(toursController.getOneTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTours);

module.exports = router;

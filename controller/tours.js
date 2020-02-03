const Tours = require('../models/Tours');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/appError');

//@desc   Top Best Cheap Tours
//@route  Get api/v1/tours/top5cheap
//@access public
exports.top5cheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, difficulty';
  next();
};

//@desc   Get All Tours
//@route  Get api/v1/tours
//@access public
exports.getTours = async (req, res, next) => {
  try {
    const features = new ApiFeatures(Tours.find(), req.query)
      .filter()
      .sorting()
      .limiting()
      .paginate();
    const tours = await features.model;

    res.status(200).json({
      success: true,
      results: tours.length,
      data: tours
    });
  } catch (err) {
    next(err);
  }
};

//@desc   Get Single Tours
//@route  Get api/v1/tours/:id
//@access public
exports.getOneTour = async (req, res, next) => {
  try {
    const tour = await Tours.findById(req.params.id);

    if (!tour) {
      return next(
        new AppError(`No Resource Found With id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (err) {
    next(err);
  }
};

//@desc   Create Tours
//@route  POST api/v1/tours/
//@access public
exports.createTours = async (req, res, next) => {
  try {
    const tour = await Tours.create(req.body);

    res.status(201).json({
      success: true,
      data: tour
    });
  } catch (err) {
    next(new AppError('No resource found', 404));
  }
};

//@desc   Update Tours
//@route  POST api/v1/tours/:id
//@access private
exports.updateTour = async (req, res, next) => {
  try {
    const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!tour) {
      return next(
        new AppError(`No Resource Found With id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (err) {
    next(err);
  }
};

//@desc   Delete Tours
//@route  Delete api/v1/tours/:id
//@access private
exports.deleteTours = async (req, res, next) => {
  try {
    const tour = await Tours.findByIdAndRemove(req.params.id);

    if (!tour) {
      return next(
        new AppError(`No Resource Found With id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

//@desc   Get Tours stats
//@route  Get api/v1/tours/tourstats
//@access public
exports.getTourStats = async (req, res, next) => {
  try {
    const stat = await Tours.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          average_price: { $avg: '$price' },
          average_rating: { $avg: '$ratingsAverage' },
          num_rating: { $sum: '$ratingsQuantity' },
          min_price: { $min: '$price' },
          max_price: { $max: '$price' },
          total_tours: { $sum: 1 }
        }
      },
      {
        $sort: { average_price: 1 }
      }
    ]);
    res.status(200).json({
      status: true,
      data: stat
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      msg: err.message
    });
  }
};

//@desc   Get Tours Monthly Plan
//@route  Get api/v1/tours/monthly-plan/:year
//@access public
exports.getTourMonthlyPlan = async (req, res, next) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tours.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          number_tours: { $sum: 1 },
          name_tour: { $push: '$name' }
        }
      },
      {
        $addFields: {
          month: '$_id'
        }
      },
      {
        $project: { _id: 0 }
      },
      {
        $sort: { number_tours: -1 }
      }
    ]);

    res.status(200).json({
      status: true,
      results: plan.length,
      data: plan
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      msg: err.message
    });
  }
};

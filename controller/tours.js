const Tours = require('../models/Tours');
const ApiFeatures = require('../utils/ApiFeatures');

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
    res.status(404).json({
      msg: err.message
    });
  }
};

//@desc   Get Single Tours
//@route  Get api/v1/tours/:id
//@access public
exports.getOneTour = async (req, res, next) => {
  try {
    const tour = await Tours.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (err) {
    res.status(400).json({
      msg: err.message
    });
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
    res.status(404).json({
      msg: err.message
    });
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

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      msg: err.message
    });
  }
};

//@desc   Delete Tours
//@route  Delete api/v1/tours/:id
//@access private
exports.deleteTours = async (req, res, next) => {
  try {
    await Tours.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(404).json({
      msg: err.message
    });
  }
};

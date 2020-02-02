const Tours = require('../models/Tours');

//@desc   Get All Tours
//@route  Get api/v1/tours
//@access public
exports.getTours = async (req, res, next) => {
  try {
    const tours = await Tours.find();

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

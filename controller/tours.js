const Tours = require('../models/Tours');

//@desc   Get All Tours
//@route  Get api/v1/tours
//@access public
exports.getTours = async (req, res, next) => {
  try {
    //1. filtering
    let query = { ...req.query };
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach(el => delete query[el]);
    query = JSON.stringify(query).replace(
      /\b(gt|gte|lt|lte|in)\b/,
      match => `$${match}`
    );
    let queryResult = Tours.find(JSON.parse(query));
    //2. sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queryResult = queryResult.sort(sortBy);
    } else {
      queryResult = queryResult.sort('-createdAt');
    }
    //3. fields limiting
    if (req.query.fields) {
      const field = req.query.fields.split(',').join(' ');
      queryResult = queryResult.select(field);
    } else {
      queryResult = queryResult.select('-__v');
    }
    //4 pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 3;
    const skip = (page - 1) * limit;
    queryResult = queryResult.skip(skip).limit(limit);

    const tours = await queryResult;

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

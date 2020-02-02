//@desc   Get All Tours
//@route  Get api/v1/tours
//@access public
exports.getTours = async (req, res, next) => {
  try {
    res.status(200).json({
      msg: 'this is a get route'
    });
  } catch (err) {
    res.status(404).json({
      msg: 'route not found'
    });
  }
};

//@desc   Get Single Tours
//@route  Get api/v1/tours/:id
//@access public
exports.getOneTour = async (req, res, next) => {
  try {
    res.status(200).json({
      msg: `this is a get route with id ${req.params.id} `
    });
  } catch (err) {
    res.status(404).json({
      msg: `route not found with id: ${req.params.id}`
    });
  }
};

//@desc   Create Tours
//@route  POST api/v1/tours/
//@access public
exports.createTours = async (req, res, next) => {
  try {
    res.status(201).json({
      msg: 'this is a post route'
    });
  } catch (err) {
    res.status(404).json({
      msg: 'route not found'
    });
  }
};

//@desc   Update Tours
//@route  POST api/v1/tours/:id
//@access private
exports.updateTour = async (req, res, next) => {
  try {
    res.status(200).json({
      msg: `this is a patch route with id ${req.params.id} `
    });
  } catch (err) {
    res.status(404).json({
      msg: `route not found with id: ${req.params.id}`
    });
  }
};

//@desc   Delete Tours
//@route  Delete api/v1/tours/:id
//@access private
exports.deleteTours = async (req, res, next) => {
  try {
    res.status(200).json({
      msg: `this is a delete route with id ${req.params.id} `
    });
  } catch (err) {
    res.status(404).json({
      msg: `route not found with id: ${req.params.id}`
    });
  }
};

//@desc   Get All Users
//@route  Get api/v1/users
//@access private
exports.getUsers = async (req, res, next) => {
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

//@desc   Get Single User
//@route  Get api/v1/uses/:id
//@access private
exports.getOneUser = async (req, res, next) => {
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

//@desc   Create User
//@route  POST api/v1/users/
//@access private
exports.createUser = async (req, res, next) => {
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

//@desc   Update User
//@route  POST api/v1/users/:id
//@access private
exports.updateUser = async (req, res, next) => {
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

//@desc   Delete Users
//@route  Delete api/v1/users/:id
//@access private
exports.deleteUser = async (req, res, next) => {
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

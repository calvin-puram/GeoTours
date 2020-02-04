const express = require('express');

const router = express.Router();

const userController = require('../controller/users');
const auth = require('../controller/auth');

router.post('/signup', auth.signup);
router.post('/login', auth.login);

router.post('/forgotPassword', auth.forgotPassword);
router.post('/resetPassword/:token', auth.resetPassword);

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

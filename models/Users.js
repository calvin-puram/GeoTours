const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'a name is required']
  },
  email: {
    type: String,
    lower: true,
    unique: true,
    required: [true, 'email is required'],
    validate: [validator.isEmail, 'Invalid email. Try again']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'password do not match'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;

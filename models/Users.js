const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    minlength: 8,
    select: false
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
  passwordChangeAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

// compare password
UserSchema.methods.comparePassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//check password
UserSchema.methods.checkpassword = function(jwtTimestamp) {
  if (this.passwordChangeAt) {
    const convertTime = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return jwtTimestamp < convertTime;
  }
  return false;
};

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;

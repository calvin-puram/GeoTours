const mongoose = require('mongoose');

const { Schema } = mongoose;

const ToursSchema = new Schema({
  name: {
    type: String,
    required: [true, 'tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'a tour duration is required']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'a tour must have a max group size']
  },
  difficulty: {
    type: String,
    required: [true, 'a tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'difficulty must be either easy, medium, or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'a tour must have a price']
  },
  summary: {
    type: String,
    required: [true, 'a tour must have a summary']
  },
  description: {
    type: String,
    required: [true, 'a tour must have a description']
  },
  imageCover: String,
  images: [String],
  startDates: [Date],
  createAt: {
    type: Date,
    default: Date.now
  }
});

const Tours = mongoose.model('Tours', ToursSchema);
module.exports = Tours;

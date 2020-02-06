const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewsSchma = new Schema({
  review: {
    type: String,
    required: [true, 'a review is required']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: 'tours',
    required: true
  }
});

ReviewsSchma.index({ tour: 1, user: 1 }, { unique: true });

const Reviews = mongoose.model('Reviews', ReviewsSchma);
module.exports = Reviews;

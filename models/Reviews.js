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
    ref: 'Tours',
    required: true
  }
});

ReviewsSchma.index({ tour: 1, user: 1 }, { unique: true });

ReviewsSchma.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

// calulate average ratings
ReviewsSchma.statics.calcRating = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' }
      }
    }
  ]);
  await this.model('Tours').findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].ratingsAverage,
    ratingsQuantity: stats[0].nRating
  });
};

ReviewsSchma.post('save', function() {
  this.constructor.calcRating(this.tour);
});

ReviewsSchma.pre('remove', function(next) {
  this.constructor.calcRating(this.tour);
  next();
});

const Reviews = mongoose.model('Reviews', ReviewsSchma);
module.exports = Reviews;

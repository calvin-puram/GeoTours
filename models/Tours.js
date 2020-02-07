const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema } = mongoose;

const ToursSchema = new Schema(
  {
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
      default: 4.5,
      min: 1,
      max: 5
    },
    slug: String,
    secret: {
      type: Boolean,
      default: false,
      select: false
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price']
    },
    startLocation: {
      type: {
        type: String,
        enum: 'Point'
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    location: [
      {
        type: {
          type: String,
          enum: 'Point'
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: `discount ({VALUE}) must be lower than the price (${this.price})`
      }
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
      default: Date.now,
      select: false
    },
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//virtual property
ToursSchema.virtual('durationInWeeks').get(function() {
  return this.duration / 7;
});

// slug
ToursSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//secret tour
ToursSchema.pre(/^find/, function(next) {
  this.find({ secret: { $ne: true } });
  next();
});

//aggrageation middleware
ToursSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  
  next();
});

//embedding users to tour
// ToursSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await Users.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// });

// reference user to tour
ToursSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -createdAt'
  });
  next();
});

// virtual populate
ToursSchema.virtual('reviews', {
  ref: 'Reviews',
  localField: '_id',
  foreignField: 'tour'
});

// ToursSchema.pre(/^find/, function(next) {
//   this.populate('reviews');
//   next();
// });

const Tours = mongoose.model('Tours', ToursSchema);
module.exports = Tours;

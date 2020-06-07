/**
 * @jest-environment node
 */

/* eslint-disable no-undef */
// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest');

const server = require('../../../app');

const app = () => supertest(server);
const DB = require('../../utils/db');
const Tours = require('../../../models/Tours');
const Users = require('../../../models/Users');

const TOP5CHEAP_URL = '/api/v1/tours/top5cheap';

describe('The get top 5 tours process', () => {
  const data = {
    name: 'The Forest Hiker',
    duration: 5,
    maxGroupSize: 25,
    difficulty: 'easy',
    ratingsAverage: 4.7,
    ratingsQuantity: 37,
    price: 397,
    summary: 'Breathtaking hike ',
    description: 'Ut enim ad minim ',
    imageCover: 'tour-1-cover.jpg',
    images: ['tour-1-1.jpg', 'tour-1-2.jpg', 'tour-1-3.jpg'],
    startDates: ['2021-04-25,10:00', '2021-07-20,10:00', '2021-10-05,10:00']
  };

  beforeEach(async () => {
    await DB.connectDB();
    await Tours.create(data);
    request = () => {
      return app().get(TOP5CHEAP_URL);
    };
  });

  it('should get top 5 cheap tours', async () => {
    const res = await request();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeLessThan(6);
  });

  afterEach(async () => {
    await Tours.deleteMany();
    await Users.deleteMany();
    await DB.closeDB();
  });
});

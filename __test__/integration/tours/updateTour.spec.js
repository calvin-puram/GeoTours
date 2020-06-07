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

describe('The update tour process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4',
    role: 'admin'
  };

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

  const updateTour = { name: 'Breathtaking hike' };

  let admin;

  beforeEach(async () => {
    await DB.connectDB();
    admin = await Users.create(user);
    await Tours.create(data);
    request = (url, token) => {
      return app()
        .patch(url)
        .set('authorization', `Bearer ${token}`)
        .send(updateTour);
    };
  });

  it('should update a particular  tour with a given id', async () => {
    const token = await admin.sendJWT();
    const singleTour = await Tours.findOne({ name: 'The Forest Hiker' });

    const res = await request(`/api/v1/tours/${singleTour._id}`, token);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  afterEach(async () => {
    await Tours.deleteMany();
    await Users.deleteMany();
    await DB.closeDB();
  });
});

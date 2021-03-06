/**
 * @jest-environment node
 */

/* eslint-disable no-undef */
// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest');

const server = require('../../../app');

const app = () => supertest(server);
const DB = require('../../utils/db');
const Users = require('../../../models/Users');

describe('The update user process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4',
    role: 'admin'
  };

  let newUser = {
    name: 'calvin',
    email: 'puram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  const updatedUser = {
    name: 'john'
  };

  let token;
  let request;

  beforeEach(async () => {
    await DB.connectDB();
    newUser = await Users.create(newUser);
    request = (url, data) => {
      return app()
        .patch(url)
        .set('authorization', `Bearer ${token}`)
        .send(data);
    };
  });

  it('should update new user ', async () => {
    const currentUser = await Users.create(user);
    token = currentUser.sendJWT();
    const id = newUser._id;

    const res = await request(`/api/v1/users/${id}`, updatedUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  afterEach(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

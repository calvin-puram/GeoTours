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

describe('The delete user process', () => {
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

  let token;
  let request;
  let currentUser;

  beforeEach(async () => {
    await DB.connectDB();
    currentUser = await Users.create(user);
    request = url => {
      return app()
        .delete(url)
        .set('authorization', `Bearer ${token}`);
    };
  });

  it('should delete a user ', async () => {
    newUser = await Users.create(newUser);
    const id = newUser._id;
    token = currentUser.sendJWT();

    const res = await request(`/api/v1/users/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  afterEach(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

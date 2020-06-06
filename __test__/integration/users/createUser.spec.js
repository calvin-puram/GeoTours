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

describe('The update me process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4',
    role: 'admin'
  };

  const newUser = {
    name: 'calvin',
    email: 'puram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let token;
  let request;

  beforeEach(async () => {
    await DB.connectDB();

    request = url => {
      return app()
        .post(url)
        .set('authorization', `Bearer ${token}`)
        .send(newUser);
    };
  });

  it('should create new user ', async () => {
    const currentUser = await Users.create(user);
    token = currentUser.sendJWT();

    const res = await request(`/api/v1/users/`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  afterEach(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

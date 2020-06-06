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

  let token;
  let request;

  beforeEach(async () => {
    await DB.connectDB();

    request = url => {
      return app()
        .get(url)
        .set('authorization', `Bearer ${token}`);
    };
  });

  it('should get user from the database', async () => {
    const currentUser = await Users.create(user);
    token = currentUser.sendJWT();
    const id = currentUser._id;

    const res = await request(`/api/v1/users/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  afterEach(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

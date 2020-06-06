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

const GET_USERS_URL = '/api/v1/users';

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

    request = () => {
      return app()
        .get(GET_USERS_URL)
        .set('authorization', `Bearer ${token}`);
    };
  });

  it('should get all user from the database', async () => {
    const currentUser = await Users.create(user);
    token = currentUser.sendJWT();

    const res = await request();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('should throw error if user role is not an admin', async () => {
    user.role = 'user';
    const currentUser = await Users.create(user);
    token = currentUser.sendJWT();

    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe('You are not authorize to perform this action');
  });

  afterEach(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

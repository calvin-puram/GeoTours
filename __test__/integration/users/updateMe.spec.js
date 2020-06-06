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

const UPDATEME_URL = '/api/v1/users/updateMe';

describe('The update me process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };
  const updateUser = {};
  let token;
  let request;
  let currentUser;

  beforeAll(async () => {
    await DB.connectDB();
    currentUser = await Users.create(user);
    request = () => {
      return app()
        .patch(UPDATEME_URL)
        .set('authorization', `Bearer ${token}`)
        .send(updateUser);
    };
  });

  it('should throw error if update user details has password field', async () => {
    token = currentUser.sendJWT();
    updateUser.name = 'calvin';
    updateUser.password = '23444555';
    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe(
      'you can only update email and name in this route'
    );
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

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

const UPDATEPASSWORD_URL = '/api/v1/users/updatePassword';

describe('The login process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };
  const updateUser = {
    currentPassword: user.password,
    newPassword: user.password,
    passwordConfirm: user.password
  };
  let token;
  let request;
  let currentUser;

  beforeAll(async () => {
    await DB.connectDB();
    currentUser = await Users.create(user);
    request = () => {
      return app()
        .patch(UPDATEPASSWORD_URL)
        .set('authorization', `Bearer ${token}`)
        .send(updateUser);
    };
  });

  it('should update user password if token is found', async () => {
    token = currentUser.sendJWT();
    const res = await request();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

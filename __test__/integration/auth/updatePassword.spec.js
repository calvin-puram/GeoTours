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
  let updateUser = {
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

  it('should throw error if user newPassword & currentPassword fields are empty', async () => {
    token = currentUser.sendJWT();
    updateUser = {};
    const res = await request();

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe('all fields are required');
  });

  it('should throw error if no user with currentPassword', async () => {
    token = currentUser.sendJWT();
    updateUser = {
      currentPassword: '23234rw3r34',
      newPassword: user.password,
      passwordConfirm: user.password
    };
    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe('Invalid Credentials');
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

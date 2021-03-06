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

const LOGIN_URL = '/api/v1/users/login';

describe('The login process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };
  let loginUser = {
    email: user.email,
    password: user.password
  };
  let request;

  beforeAll(async () => {
    await DB.connectDB();
    await Users.create(user);
    request = () => {
      return app()
        .post(LOGIN_URL)
        .send(loginUser);
    };
  });

  it('should login a user', async () => {
    const res = await request();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  it('should throw error if no password or email is provided ', async () => {
    loginUser = {};
    const res = await request();

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe('email and password are required');
  });

  it('if no user or invalid password should throw error', async () => {
    loginUser = {
      email: 'xyz@gmail.com',
      password: '2begoduju'
    };
    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe('Invalid credential');
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

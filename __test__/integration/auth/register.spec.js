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

const REGISTER_URL = '/api/v1/users/signup';

describe('The auth.js file', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };
  let request;

  beforeAll(async () => {
    await DB.connectDB();

    request = () => {
      return app()
        .post(REGISTER_URL)
        .send(user);
    };
  });

  it('should register a new user', async () => {
    const response = await request();

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.token).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it('should check if user exist in the database', async () => {
    const response = await request();

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('user already in the database');
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

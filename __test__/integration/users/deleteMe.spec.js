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

const UPDATEME_URL = '/api/v1/users/deleteMe';

describe('The update me process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let token;
  let request;
  let currentUser;

  beforeEach(async () => {
    await DB.connectDB();
    currentUser = await Users.create(user);
    request = () => {
      return app()
        .delete(UPDATEME_URL)
        .set('authorization', `Bearer ${token}`);
    };
  });

  it('should delete a user setting active to false', async () => {
    token = currentUser.sendJWT();

    const res = await request();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const deletedUser = await Users.findOne({
      email: user.email
    });
    expect(deletedUser.active).toBeFalsy();
  });

  afterEach(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

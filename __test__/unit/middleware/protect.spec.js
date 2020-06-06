/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const DB = require('../../utils/db');
const Users = require('../../../models/Users');
const { protect } = require('../../../controller/auth');

class Response {
  status(status) {
    this.status = status;
    return this;
  }

  json(data) {
    return data;
  }
}

describe('the protect middleware', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };
  let createdUser;
  beforeAll(async () => {
    await DB.connectDB();

    createdUser = await Users.create(user);
  });

  it('should verify the auth token', async () => {
    const token = await createdUser.sendJWT();

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const res = new Response();
    const next = jest.fn();
    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

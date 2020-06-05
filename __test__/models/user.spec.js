/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const bcrypt = require('bcryptjs');

const Users = require('../../models/Users');
const DB = require('../utils/db');

describe('the user model', () => {
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

  it('should hash the user password before saving to database', async () => {
    const hashedPassword = await bcrypt.compare(
      user.password,
      createdUser.password
    );
    expect(hashedPassword).toBeTruthy();
    expect(createdUser.passwordConfirm).not.toBeDefined();
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

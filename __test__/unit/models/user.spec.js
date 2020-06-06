/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../../../models/Users');
const DB = require('../../utils/db');

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

  it('should send jwt token to user', async () => {
    const token = await createdUser.sendJWT();
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    const newUser = await Users.findById(verifiedUser.id);

    expect(newUser.name).toBe(user.name);
    expect(verifiedUser.id).toBe(JSON.parse(JSON.stringify(newUser._id)));
  });

  afterAll(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

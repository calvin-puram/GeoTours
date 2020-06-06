/**
 * @jest-environment node
 */

/* eslint-disable no-undef */
// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest');
const nodemailer = require('nodemailer');

const server = require('../../../app');

const sendMailMock = jest.fn().mockReturnValue('reset link sent successfully');
jest.mock('nodemailer');

nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

const app = () => supertest(server);
const DB = require('../../utils/db');
const Users = require('../../../models/Users');

const FORGOTPASSWORD_URL = '/api/v1/users/forgotPassword';

describe('The forgot password process', () => {
  const user = {
    name: 'calvin',
    email: 'cpuram1@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };
  let forgotPasswordEmail;
  let request;

  beforeEach(async () => {
    await DB.connectDB();
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();

    request = () => {
      return app()
        .post(FORGOTPASSWORD_URL)
        .send(forgotPasswordEmail);
    };
  });

  it('should throw error if user email field is empty', async () => {
    forgotPasswordEmail = {};
    const res = await request();

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('email field is required');
    expect(res.body.success).toBe(false);
  });

  it('should throw error if user email is not found', async () => {
    forgotPasswordEmail = { email: 'xy@gmail.com' };
    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('this email is not registered');
    expect(res.body.success).toBe(false);
  });

  it('should send rest link via email', async () => {
    forgotPasswordEmail = { email: user.email };
    await Users.create(user);
    const res = await request();

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe(
      'your password reset token has been sent to your email'
    );
    expect(res.body.success).toBe(true);
    expect(sendMailMock).toHaveBeenCalled();

    const freshUser = await Users.findOne({ email: user.email });

    expect(freshUser.passwordResetToken).toBeDefined();
    expect(freshUser.passwordResetExpires).toBeDefined();
  });

  afterEach(async () => {
    await Users.deleteMany();
    await DB.closeDB();
  });
});

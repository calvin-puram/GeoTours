/**
 * @jest-environment node
 */

/* eslint-disable no-undef */
// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest');

const server = require('../../../app');

const app = () => supertest(server);
const DB = require('../../utils/db');
const Tours = require('../../../models/Tours');

const GET_TOURS_URL = '/api/v1/tours';

describe('The get all tour process', () => {
  beforeEach(async () => {
    await DB.connectDB();

    request = () => {
      return app().get(GET_TOURS_URL);
    };
  });

  it('should get all tours', () => {});

  afterEach(async () => {
    await DB.closeDB();
  });
});

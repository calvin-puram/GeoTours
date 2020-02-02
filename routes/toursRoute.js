const express = require('express');

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      res.status(200).json({
        msg: 'this is a get route'
      });
    } catch (err) {
      res.status(404).json({
        msg: 'route not found'
      });
    }
  })
  .post(async (req, res, next) => {
    try {
      res.status(201).json({
        msg: 'this is a post route'
      });
    } catch (err) {
      res.status(404).json({
        msg: 'route not found'
      });
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      res.status(200).json({
        msg: `this is a get route with id ${req.params.id} `
      });
    } catch (err) {
      res.status(404).json({
        msg: `route not found with id: ${req.params.id}`
      });
    }
  })
  .patch(async (req, res, next) => {
    try {
      res.status(200).json({
        msg: `this is a patch route with id ${req.params.id} `
      });
    } catch (err) {
      res.status(404).json({
        msg: `route not found with id: ${req.params.id}`
      });
    }
  })
  .delete(async (req, res, next) => {
    try {
      res.status(200).json({
        msg: `this is a delete route with id ${req.params.id} `
      });
    } catch (err) {
      res.status(404).json({
        msg: `route not found with id: ${req.params.id}`
      });
    }
  });

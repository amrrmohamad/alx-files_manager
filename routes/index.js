import express from 'express';
import AppController from '../controllers/AppController.js';

const express = require('express');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

module.exports = router;

export default router;


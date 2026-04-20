const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// The Create Account API
router.post('/register', authController.register);

// The Login API
router.post('/login', authController.login);

module.exports = router;
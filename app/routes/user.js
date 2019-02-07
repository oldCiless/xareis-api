const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const UserController = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', checkAuth, UserController.me);

module.exports = router;

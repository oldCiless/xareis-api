const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const UserController = require('../controllers/user.controller');

router.get('/me', checkAuth, UserController.me);

module.exports = router;

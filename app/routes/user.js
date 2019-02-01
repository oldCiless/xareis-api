const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.get('/', UserController.user_get_all);

module.exports = router;

const express = require("express");
const router = express.Router();

const Uploader = require('../services/uploader.service');
const avatarUploader = new Uploader('./app/uploads/avatars');

const AuthController = require('../controllers/auth.controller');

router.post('/signup', avatarUploader.upload.single('avatar'), AuthController.sign_up);
router.post('/signin', AuthController.sign_in);

module.exports = router;

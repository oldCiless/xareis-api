const express = require('express');
const Uploader = require('../services/uploader.service');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();
const avatarUploader = new Uploader('./app/uploads/avatars');

router.post('/signup', avatarUploader.upload.single('avatar'), AuthController.sign_up);
router.post('/signin', AuthController.sign_in);
router.get('/me', AuthController.me);
router.post('/gencode', AuthController.gen_code);
router.post('/verify', AuthController.verify);
router.post('/forgot', AuthController.forgot);
router.patch('/change_password_with_code', AuthController.changePasswordWithCode);
module.exports = router;

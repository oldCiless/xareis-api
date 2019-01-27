const pick = require('lodash/pick');
const User = require('../models/user.model');
const jwtService = require('../services/jwt.service');

exports.sign_up = async (req, res, next) => {

    const checkUser = await User.findOne({ phone: req.body.phone });
    if (checkUser) {
        res.status(409).json({
            message: 'User already exists',
        });
    } else {
        const newUser = await User.create(pick(req.body, User.createFields));
        const token = await jwtService.genToken({ phone: req.body.phone });

        if (req.file) {
            newUser.avatar = req.file.path.replace('app\\','');
            newUser.save();
        }

        const userPublicInfo = await User.findOneWithPublicFields({
            phone: req.body.phone,
        });

        res.status(201).json({
            user: userPublicInfo,
            token: token,
            message: 'Sign Up success',
        });
    }
};

exports.sign_in = async (req, res, next) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ message: 'Incorrect data' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    if (!user.comparePasswords(password)) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = await jwtService.genToken({ phone });
    const userPublicInfo = await User.findOneWithPublicFields({ phone });

    res.status(200).json({
        user: userPublicInfo,
        token: token,
        message: 'Sign In success'
    });
};

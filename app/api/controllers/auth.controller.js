const randomString = require('randomstring');
const pick = require('lodash/pick');
const User = require('../models/user.model');

const jwtService = require('../services/jwt.service');
const m2mService = require('../services/m2m.service');

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
            newUser.avatar = req.file.path.replace('app\\', '');
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
    console.log(req.body);
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
        message: 'Sign In success',
    });
};

exports.gen_code = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'User not found' });
    }

    const user = await User.findOne(req.user);

    if (!user.codeTimeout()) {
        try {
            const code = randomString.generate({
                length: 6,
                charset: 'numeric',
            });

            const expiredDate = new Date().setMinutes(new Date().getMinutes() + 1);

            await m2mService.sendMessage(user.phone, `Ваш код верификации: ${code}`);

            user.code.code = code;
            user.code.expired = expiredDate;
            user.save();

            res.status(200).json({ message: 'New code generated' });

        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    } else {
        res.status(400).json({ message: 'Please wait' });
    }
};

exports.me = async (req, res, next) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(403).json('User not found');
    }
};

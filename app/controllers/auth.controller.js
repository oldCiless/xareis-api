const pick = require('lodash/pick');
const User = require('../models/user.model');

const jwtService = require('../services/jwt.service');
const m2mService = require('../services/m2m.service');

exports.sign_up = async (req, res, next) => {
    const checkedData = await User.findOne({ phone: req.body.phone });

    if (checkedData) {
        if (checkedData.confirmed) {
            return res.status(409).json({
                message: 'Пользователь уже существует'
            });
        } else {
            await User.deleteOne(checkedData);
        }
    }

    try {
        const user = await User.create(pick(req.body, User.createFields));

        if (req.file) {
            user.avatar = req.file.path.replace('app\\', '');
            user.save();
        }

        const userPublicInfo = await User.findOneWithPublicFields({
            phone: req.body.phone
        });

        res.status(201).json({
            user: userPublicInfo,
            message: 'Регистрация успешна'
        });
    } catch (e) {
        next(e);
    }
};

exports.sign_in = async (req, res, next) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: 'Некорректные данные' });
    }

    const user = await User.findOne({ phone });

    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (!user.comparePasswords(password)) {
        return res.status(401).json({ message: 'Неправильный пароль' });
    }

    const token = await jwtService.genToken({ phone });
    const userPublicInfo = await User.findOneWithPublicFields({ phone });

    res.status(200).json({
        user: userPublicInfo,
        token,
        message: 'Авторизация выполнена'
    });
};

exports.gen_code = async (req, res, next) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ message: 'Некорректные данные' });
    }

    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    if (!user.comparePasswords(password)) {
        return res.status(401).json({ message: 'Неправильный пароль' });
    }

    if (!user.codeTimeout()) {
        try {
            const code = user.generateCode();
            //  await m2mService.sendMessage(user.phone, `Ваш код верификации: ${code}`);
            res.status(200).json({ message: 'Новый код отправлен' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(202).json({ message: 'Пожалуйста подождите' });
    }
};

exports.verify = async (req, res, next) => {
    const { phone, password, code } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: 'Некорректные данные' });
    }

    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    if (!user.comparePasswords(password)) {
        return res.status(401).json({ message: 'Неправильный пароль' });
    }

    if (user.confirmed) {
        res.status(401).json({ message: 'Пользователь уже верифицирован' });
    }

    if (user.isVerified(code)) {
        user.confirmed = true;
        user.save();
        res.status(200).json({ message: 'Пользователь подтвержден' });
    } else {
        res.status(401).json({ message: 'Неправильный код подтверждения' });
    }
};

exports.me = async (req, res, next) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(403).json('User not found');
    }
};

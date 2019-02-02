const jwtService = require('../services/jwt.service');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        try {
            const { phone } = await jwtService.verify(authorization.replace('Bearer ', ''));
            req.user = await User.findOne({ phone });
        } catch (e) {}
    }
    next();
};

const User = require('../models/user.model');

exports.me = async (req, res, next) => {
    console.log(req.user);

    const user = await User.findOneWithPublicFields(req.user);
    res.status(200).json(user);
    console.log(req.user);
};

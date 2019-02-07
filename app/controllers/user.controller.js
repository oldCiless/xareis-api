const User = require('../models/user.model');

exports.me = async (req, res) => {
    const user = await User.findOneWithPublicFields(req.user);
    res.status(200).json(user);
};

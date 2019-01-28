const jwt = require('jsonwebtoken');

module.exports = {
    async genToken(data) {
        return await jwt.sign(data, process.env.JWT_KEY, { expiresIn: '1h' });
    },

    async verify(token) {
        try {
            return await jwt.verify(token, process.env.JWT_KEY);
        } catch (e) {
            return 'Invalid token';
        }
    }
};

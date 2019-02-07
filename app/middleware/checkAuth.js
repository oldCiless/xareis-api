module.exports = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }
    next();
};

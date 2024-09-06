const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            req.user = user;
            next()
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { authenticateJWT };

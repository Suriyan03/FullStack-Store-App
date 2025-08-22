const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'system_admin') {
        return res.status(403).json({ message: 'Access denied: Admin role required' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
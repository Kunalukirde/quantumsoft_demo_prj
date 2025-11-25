const jwt = require('jsonwebtoken');

module.exports = (req,res, next) => {
    const token = req.header('Authorization')?.split(" ")[1];

    if(!token) {
        return res.status(401).json({status: 401, message: 'Token missing. Access denied.'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({status: 401, message: 'Invalid or expired token.'});
    }
}
// roleMiddleware.js
const checkRole = (roles) => {
    return (req, res, next) => {
        // console.log(req.user.userRole)
        if (!roles.includes(req.user.userRole)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = {checkRole};

// roles given
    // 1. user role = 0
    // 2. admin role = 1
    // 3. subAdmin role = 2
    // 4. super admin = 3
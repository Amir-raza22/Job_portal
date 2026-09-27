const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }
        // Check user's role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You don't have permission."
            });
        }
        // Role is allowed
        next();
    };
};

module.exports = roleMiddleware;
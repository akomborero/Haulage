// This middleware checks if the user has the required permission
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
       
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Access Denied: ${req.user.role}s cannot perform this action.` 
            });
        }
        next();
    };
};
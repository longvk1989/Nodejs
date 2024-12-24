const roleMiddlewares = (requiredRole) => {
    return (req, res, next) => {
        try{
            const role = req.user.role;
            if (role != requiredRole) {
                return res.status(403).json({  message: 'Forbidden: You do not have the required role' });
            }

            next();
        }
        catch(err){
            res.status(500).json({  message: err.message });
        }
    };
};

module.exports = roleMiddlewares;
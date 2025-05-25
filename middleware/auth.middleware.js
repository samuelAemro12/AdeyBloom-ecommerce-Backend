import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Rename protect to authenticateToken for consistency
export const authenticateToken = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies or Authorization header
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        next(error);
    }
};

// Rename authorize to isAdmin for specific admin role check
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// Keep the original authorize function for role-based access control
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
}; 
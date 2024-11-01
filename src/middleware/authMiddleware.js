import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Forbidden credentials',
        });
    }
};

export default authMiddleware;
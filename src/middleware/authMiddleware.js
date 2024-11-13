import { getAuth } from "firebase-admin/auth";

// Middleware to verify Firebase ID Token
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split(' ')[1];

        try {
            const decodedToken = await getAuth().verifyIdToken(idToken);
            req.user = decodedToken; 
            next();
        } catch (error) {
            console.error('Firebase ID token verification failed:', error);
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired Firebase ID token',
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Forbidden: Firebase ID token missing or malformed',
        });
    }
};


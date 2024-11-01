import authService from './auth.service.js';

class AuthController {
    // Register a new user
    async register(req, res, next) {

        try {
            const { user, accessToken, refreshToken } = await authService.registerUser(req);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user,
                accessToken,
                refreshToken
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Login a user
    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

            const firebaseAccessToken = user.stsTokenManager.accessToken;
            const firebaserefreshToken = user.stsTokenManager.refreshToken;

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Login successful',
                user,
                firebaseAccessToken,
                firebaserefreshToken,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
    }

    // Logout a user
    async logout(req, res, next) {
        try {
            await authService.logoutUser();

            res.status(200).json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            console.error('Logout Error:', error);
            res.status(500).json({
                success: false,
                message: 'Logout failed',
            });
        }
    }

    // Refresh JWT token
    async refreshToken(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken || !refreshTokenStore.has(refreshToken)) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = authService.generateAccessToken(decoded);

            res.status(200).json({
                success: true,
                accessToken: newAccessToken,
            });
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
        }
    }
}

export default new AuthController();

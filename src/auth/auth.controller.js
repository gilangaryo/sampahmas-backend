import authService from './auth.service.js';

class AuthController {
    async register(req, res) {

        try {
            const user = await authService.registerUser(req);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const result = await authService.loginUser(req);
            if (result instanceof Error) {
                return res.status(400).json({ status: 400, message: result.message });
            }
            return res.status(200).json({
                status: 200,
                message: "Login Success",
                data: result
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
    async logout(req, res) {
        try {
            const result = await authService.logoutUser();

            if (result instanceof Error) {
                return res.status(401).json({ status: 401, message: result.message });
            }
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

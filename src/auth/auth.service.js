import authRepository from './auth.repository.js';
import jwt from 'jsonwebtoken';
import CreateUserSchema from '../validation/users.validation.js';
import userRepository from '../users/users.repository.js';

class AuthService {
    // Register a new user
    async registerUser(req) {
        try {
            const createUserRequest = CreateUserSchema.parse(req.body);

            if (!createUserRequest) {
                throw new Error('Invalid user data.');
            }

            const userExist = await userRepository.getUserByEmail(createUserRequest.email);
            if (userExist) {
                throw new Error('User already exists.');
            }

            const user = await authRepository.register(createUserRequest.email, createUserRequest.password, createUserRequest.username, createUserRequest.phone);

            // Generate JWT tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            return { user, accessToken, refreshToken };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Login user
    async loginUser(email, password) {
        try {
            const user = await authRepository.login(email, password);


            // Generate JWT tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            return { user, accessToken, refreshToken };
        } catch (error) {
            console.error('Error logging in user:', error);
            throw new Error(error.message);
        }
    }

    // Logout user
    async logoutUser() {
        try {
            await authRepository.logout();  // Call the repository’s logout method
            return true;
        } catch (error) {
            console.error('Error logging out user:', error);
            throw new Error(error.message);
        }
    }

    // Generate JWT Access Token
    generateAccessToken(user) {
        const payload = {
            userId: user.uid,
            email: user.email,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    }

    // Generate JWT Refresh Token
    generateRefreshToken(user) {
        const payload = {
            userId: user.uid,
            email: user.email,
        };
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }
}

export default new AuthService();

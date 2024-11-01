import userService from './users.service.js';
import jwt from 'jsonwebtoken';

class UserController {
    async login(req, res) {
        const { email, password } = req.body;

        const user = await userService.validateUser(email, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate tokens
        const accessToken = authService.generateAccessToken(user);
        const refreshToken = authService.generateRefreshToken(user);

        // Return token to the client
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
        });
    }

    // Get all users
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user by ID
    async getUserById(req, res, next) {
        try {
            const userId = req.params.userId;
            const user = await userService.getUserById(userId);
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserByEmail(req, res, next) {
        try {
            const email = req.body.email;
            const user = await userService.getUserByEmail(email);
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserByRFID(req, res, next) {
        try {
            const RFID = req.params.rfidTag;
            const user = await userService.getUserByRFID(RFID);
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // Create a new user
    async createUser(req, res, next) {
        try {
            const userId = req.body.uid;
            const userData = req.body;
            await userService.createUser(userId, userData);
            res.status(201).json({
                success: true,
                message: "User created successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    // Update a user
    async updateUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const userData = req.body;
            await userService.updateUser(userId, userData);
            res.status(200).json({
                success: true,
                message: "User updated successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete a user
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.userId;
            await userService.deleteUser(userId);
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();

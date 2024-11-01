// userService.js
import userRepository from './users.repository.js';

class UserService {
    async getAllUsers() {
        const users = await userRepository.getAllUsers();
        return users;
    }

    async getUserById(userId) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async getUserByEmail(email) {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async getUserByRFID(RFID) {
        const user = await userRepository.getUserByRFID(RFID);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(userId, username, email, phone) {
        await userRepository.addUser(userId, username, email, phone);
    }

    async updateUser(userId, userData) {
        await userRepository.updateUser(userId, userData);
    }

    async deleteUser(userId) {
        await userRepository.deleteUser(userId);
    }
}

export default new UserService();

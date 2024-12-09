import { db } from '../database/databaseAdmin.js';

class UserRepository {
    async getAllUsers() {
        try {
            const ref = db.ref('users');
            const snapshot = await ref.once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw new Error('Failed to fetch all users.');
        }
    }

    async getUserById(userId) {
        try {
            const ref = db.ref(`users/${userId}`);
            const snapshot = await ref.once('value');
            return snapshot.val();
        } catch (error) {
            console.error(`Error fetching user by ID (${userId}):`, error);
            throw new Error('Failed to fetch user by ID.');
        }
    }

    async getUserByEmail(email) {
        try {
            const ref = db.ref('users');
            const snapshot = await ref.orderByChild('email').equalTo(email).once('value');
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userId = Object.keys(userData)[0];
                return userData[userId];
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error fetching user by email (${email}):`, error);
            throw new Error('Failed to fetch user by email.');
        }
    }

    async getUserByRFID(rfidValue) {
        try {
            const ref = db.ref('users');
            const snapshot = await ref.orderByChild('rfid').equalTo(rfidValue).once('value');
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userId = Object.keys(userData)[0];
                return userData[userId];
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error fetching user by RFID (${rfidValue}):`, error);
            throw new Error('Failed to fetch user by RFID.');
        }
    }

    async addUser(userId, username, email, phone, role) {
        try {
            const userData = {
                uid: userId,
                name: username,
                email: email,
                phone: phone,
                alamat: "",
                balance: 0,
                botolTerkumpul: 0,
                imageProfile: "",
                kodepos: "",
                kota: "",
                nik: "",
                points: 0,
                province: "",
                rfid: "",
                role: role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const ref = db.ref(`users/${userId}`);
            await ref.set(userData);
            return { success: true, message: 'User added successfully.' };
        } catch (error) {
            console.error(`Error adding user (${userId}):`, error);
            throw new Error('Failed to add user.');
        }
    }

    async updateUser(userId, userData) {
        try {
            const ref = db.ref(`users/${userId}`);
            await ref.update(userData);
            return { success: true, message: 'User updated successfully.' };
        } catch (error) {
            console.error(`Error updating user (${userId}):`, error);
            throw new Error('Failed to update user.');
        }
    }

    async updatePoints(userId, updatedTotalPoints) {
        try {
            const ref = db.ref(`users/${userId}`);
            await ref.update({ points: updatedTotalPoints });
            return { success: true, message: 'Points updated successfully.' };
        } catch (error) {
            console.error(`Error updating points for user (${userId}):`, error);
            throw new Error('Failed to update points.');
        }
    }

    async updateLastCounter(userId, counter) {
        try {
            const ref = db.ref(`users/${userId}`);
            await ref.update({ lastCounter: counter });
            return { success: true, message: 'Last counter updated successfully.' };
        } catch (error) {
            console.error(`Error updating last counter for user (${userId}):`, error);
            throw new Error('Failed to update last counter.');
        }
    }

    async updateBottle(userId, botolTerkumpul) {
        try {
            const ref = db.ref(`users/${userId}`);
            await ref.update({ botolTerkumpul: botolTerkumpul });
            return { success: true, message: 'Bottle count updated successfully.' };
        } catch (error) {
            console.error(`Error updating bottle count for user (${userId}):`, error);
            throw new Error('Failed to update bottle count.');
        }
    }

    async deleteUser(userId) {
        try {
            const ref = db.ref(`users/${userId}`);
            await ref.remove();
            return { success: true, message: 'User deleted successfully.' };
        } catch (error) {
            console.error(`Error deleting user (${userId}):`, error);
            throw new Error('Failed to delete user.');
        }
    }

    async updateRFID(userId, rfid) {
        try {
            const ref = db.ref(`users/${userId}`);
            await ref.update({ rfid: rfid });
            return { success: true, message: 'RFID updated successfully.', userId, rfid };
        } catch (error) {
            console.error(`Error updating RFID for user (${userId}):`, error);
            throw new Error('Failed to update RFID.');
        }
    }
}

export default new UserRepository();

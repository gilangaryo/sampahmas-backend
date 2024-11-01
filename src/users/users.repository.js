// userRepository.js
import { db } from '../database/databaseAdmin.js';

class UserRepository {
    async getAllUsers() {
        const ref = db.ref('users');
        const snapshot = await ref.once('value');
        return snapshot.val();
    }

    async getUserById(userId) {
        const ref = db.ref(`users/${userId}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    }
    async getUserByEmail(email) {
        const ref = db.ref('users');
        const snapshot = await ref.orderByChild('email').equalTo(email).once('value');
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userId = Object.keys(userData)[0];
            return userData[userId];
        } else {
            return null;
        }
    }
    async getUserByRFID(rfidValue) {
        const ref = db.ref('users');

        const snapshot = await ref.orderByChild('rfid').equalTo(rfidValue).once('value');

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userId = Object.keys(userData)[0];
            return userData[userId];
        } else {
            return null;
        }
    }

    async addUser(userId, username, email, phone) {
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const ref = db.ref(`users/${userId}`);
        await ref.set(userData);
    }


    async updateUser(userId, userData) {
        const ref = db.ref(`users/${userId}`);
        await ref.update(userData);
    }

    async updatePoints(userId, updatedTotalPoints) {
        const ref = db.ref(`users/${userId}`);
        await ref.update({ points: updatedTotalPoints });
    }
    async updateBottle(userId, botolTerkumpul) {
        const ref = db.ref(`users/${userId}`);
        await ref.update({ botolTerkumpul: botolTerkumpul });
    }


    async deleteUser(userId) {
        const ref = db.ref(`users/${userId}`);
        await ref.remove();
    }
}

export default new UserRepository();

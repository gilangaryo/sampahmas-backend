import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from '../database/databaseAdmin.js';
import { firebaseClientApp } from '../database/databaseClient.js';
import userRepository from '../users/users.repository.js';
class AuthRepository {
    async register(email, password, username, phone) {
        const auth = getAuth(firebaseClientApp);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await userRepository.addUser(userCredential.user.uid, username, email, phone);
            return userCredential.user;
        } catch (error) {
            console.error('Register Error:', error);
            throw new Error(error.message);
        }
    }

    // Login user
    async login(email, password) {
        const auth = getAuth(firebaseClientApp);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Login Error:', error);
            throw new Error(error.message);
        }
    }

    // Logout user
    async logout() {
        const auth = getAuth(firebaseClientApp);
        try {
            await signOut(auth);
            return true;
        } catch (error) {
            console.error('Logout Error:', error);
            throw new Error(error.message);
        }
    }
}

export default new AuthRepository();

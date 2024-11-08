import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from '../database/databaseAdmin.js'; // Firestore instance for storing user roles
import { firebaseClientApp } from '../database/databaseClient.js';
import userRepository from '../users/users.repository.js';
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions

class AuthRepository {
    async register(email, password, username, phone, role = 'user') { // Default role is 'user'
        const auth = getAuth(firebaseClientApp);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Save user details in Firestore with a role
            await userRepository.addUser(uid, username, email, phone);

            // Set role information in Firestore
            const userDoc = doc(db, 'users', uid);
            await setDoc(userDoc, { role }, { merge: true });

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

    // Fetch user role from Firestore
    async getUserRole(uid) {
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                return userDoc.data().role;
            }
            return null; // Role not found
        } catch (error) {
            console.error('Get Role Error:', error);
            throw new Error('Failed to get user role');
        }
    }
}

export default new AuthRepository();

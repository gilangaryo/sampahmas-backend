import firebaseAdmin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Replace escaped newline characters in the private key (common issue when using environment variables)
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

// Initialize Firebase Admin SDK
const firebaseAdminApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Firebase Admin SDK services
const db = firebaseAdminApp.database();
const adminAuth = firebaseAdminApp.auth();

export { db, adminAuth };

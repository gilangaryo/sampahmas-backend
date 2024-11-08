import { db } from '../database/databaseAdmin.js';
import midtransClient from 'midtrans-client'; // Import without destructuring

// Inisialisasi Snap Client
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

class PaymentRepository {
    // Membuat transaction token dari Midtrans dan menyimpan transaksi ke database
    async createTransactionToken(orderId, amount) {
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount
            },
            credit_card: { secure: true }
        };

        const transaction = await snap.createTransaction(parameter);

        // Simpan transaksi ke Firebase Realtime Database
        const ref = db.ref(`transactions/${orderId}`);
        await ref.set({
            orderId: orderId,
            amount: amount,
            transactionToken: transaction.token,
            status: 'pending'
        });

        return transaction.token;
    }

    // Mengambil transaksi berdasarkan ID dari Firebase
    async getTransactionById(orderId) {
        const ref = db.ref(`transactions/${orderId}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    }

    // Memperbarui status transaksi
    async updateTransactionStatus(orderId, status) {
        const ref = db.ref(`transactions/${orderId}`);
        await ref.update({ status });

        // Ambil transaksi yang telah diperbarui
        const updatedSnapshot = await ref.once('value');
        return updatedSnapshot.val();
    }
}

export default new PaymentRepository();

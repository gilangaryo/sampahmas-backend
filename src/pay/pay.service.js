import PaymentRepository from './pay.repository.js';
import midtransClient from 'midtrans-client'; // Import without destructuring

// Inisialisasi Core API Client
const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const snapApi = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});
export const processPayment = async (orderId, amount) => {
    if (!orderId || !amount) throw new Error('Order ID and amount are required');

    try {
        const transactionToken = await PaymentRepository.createTransactionToken(orderId, amount);
        return transactionToken;
    } catch (error) {
        console.error('Error in processPayment:', error);
        throw new Error('Failed to process payment');
    }
};

export const processNotification = async (notification) => {
    const statusResponse = await snapApi.transaction.notification(notification);
    const { order_id: orderId, transaction_status: transactionStatus, fraud_status: fraudStatus } = statusResponse;
    let status;

    if (transactionStatus === 'capture') {
        status = fraudStatus === 'accept' ? 'success' : 'failed';
    } else if (transactionStatus === 'settlement') {
        status = 'completed';
    } else if (transactionStatus === 'pending') {
        status = 'pending';
    } else if (['deny', 'expire', 'cancel'].includes(transactionStatus)) {
        status = 'failed';
    }


    return await PaymentRepository.updateTransactionStatus(orderId, status);
};

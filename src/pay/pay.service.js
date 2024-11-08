import PaymentRepository from './pay.repository.js';
import midtransClient from 'midtrans-client'; // Import without destructuring

// Inisialisasi Core API Client
const coreApi = new midtransClient.CoreApi({
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
    const transactionId = notification.transaction_id;
    const transactionStatus = await coreApi.transaction.status(transactionId);

    const orderId = transactionStatus.order_id;
    let status;

    switch (transactionStatus.transaction_status) {
        case 'capture':
            status = transactionStatus.fraud_status === 'accept' ? 'success' : 'failed';
            break;
        case 'settlement':
            status = 'completed';
            break;
        case 'pending':
            status = 'pending';
            break;
        case 'deny':
            status = 'denied';
            break;
        case 'expire':
            status = 'expired';
            break;
        case 'cancel':
            status = 'canceled';
            break;
    }

    return await PaymentRepository.updateTransactionStatus(orderId, status);
};

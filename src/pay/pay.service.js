import { createTransactionToken } from '../pay/pay.repository.js';

export const processPayment = async (orderId, amount) => {
    if (!orderId || !amount) {
        throw new Error('Order ID and amount are required');
    }

    // Additional business logic or validation can be done here if needed
    try {
        const transactionToken = await createTransactionToken(orderId, amount);
        return transactionToken;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error('Failed to process payment');
    }
};

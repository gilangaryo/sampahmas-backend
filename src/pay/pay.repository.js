import { Midtrans } from 'midtrans-client';

const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export const createTransactionToken = async (orderId, amount) => {
    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: amount
        },
        credit_card: {
            secure: true
        }
    };

    try {
        const transaction = await snap.createTransaction(parameter);
        return transaction.token;
    } catch (error) {
        console.error('Error creating transaction token:', error);
        throw new Error('Failed to create transaction token');
    }
};

// pay.controller.js
import { processPayment, processNotification } from './pay.service.js';

export const createPayment = async (req, res) => {
    const { orderId, amount } = req.body;

    try {
        const transactionToken = await processPayment(orderId, amount);
        return res.status(200).json({ transactionToken });
    } catch (error) {
        console.error('Error in createPayment:', error);
        return res.status(500).json({ message: 'Failed to create payment' });
    }
};

export const handleNotification = async (req, res) => {
    try {
        const notification = req.body;
        if (
            !notification.transaction_id ||
            !notification.transaction_status ||
            !notification.order_id ||
            !notification.payment_type
        ) {
            return res.status(400).json({ message: 'Invalid notification format' });
        }
        const result = await processNotification(notification);
        return res.status(200).json({ message: 'Notification handled', data: result });
    } catch (error) {
        console.error('Error in handleNotification:', error);
        return res.status(500).json({ message: 'Failed to handle notification' });
    }
};

// import { processPayment } from '../pay/pay.service.js';

// export const createPayment = async (req, res) => {
//     const { orderId, amount } = req.body;

//     try {
//         const transactionToken = await processPayment(orderId, amount);
//         return res.status(200).json({ transactionToken });
//     } catch (error) {
//         console.error('Error in createPayment:', error);
//         return res.status(500).json({ message: error.message });
//     }
// };

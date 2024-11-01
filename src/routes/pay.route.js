import express from 'express';
// import { createPayment } from '../pay/pay.controller.js';

const router = express.Router();

// // Test route
router.get('/', (req, res) => {
    res.send('API is running');
});
// router.post('/', createPayment);

export default router;

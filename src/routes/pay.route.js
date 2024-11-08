// pay.route.js
import express from 'express';
import { createPayment, handleNotification } from '../pay/pay.controller.js';

const router = express.Router();

router.post('/create-payment', createPayment);
router.post('/notification', handleNotification);

export default router;

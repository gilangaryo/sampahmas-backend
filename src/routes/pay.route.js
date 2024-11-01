import express from 'express';
import { createPayment } from '../pay/pay.controller.js';

const router = express.Router();

router.post('/', createPayment);

export default router;

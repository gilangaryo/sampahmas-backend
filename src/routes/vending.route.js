import express from 'express';
import VendingController from '../vending/vending.controller.js';

const router = express.Router();

// Apply express.raw() middleware to this route only
router.post('/upload', express.raw({ type: 'image/jpeg', limit: '10mb' }), VendingController.upload);

export default router;

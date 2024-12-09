import express from 'express';
import authController from '../auth/auth.controller.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

// router.post('/rfid', authController.rfid);

export default router;

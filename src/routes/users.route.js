import express from 'express';
import userController from '../users/users.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.get('/email', userController.getUserByEmail);
router.get('/rfid/:rfidTag', userController.getUserByRFID);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

export default router;

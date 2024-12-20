import express from 'express';
import userController from '../users/users.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); 

// router.get('/', verifyAdmin, userController.getAllUsers); // Only accessible by admin
// router.get('/:userId', verifyUserOrAdmin, userController.getUserById); // Accessible by user or admin
// router.get('/email', verifyUserOrAdmin, userController.getUserByEmail); // Accessible by user or admin
// router.get('/rfid/:rfidTag', verifyUserOrAdmin, userController.getUserByRFID); // Accessible by user or admin

router.get('/',  userController.getUser); 
router.put('/:userId',  userController.updateUser); 
router.delete('/:userId',  userController.deleteUser);

export default router;

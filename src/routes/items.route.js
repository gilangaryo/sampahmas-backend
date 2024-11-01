import express from 'express';
import itemController from '../items/items.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, itemController.getAllItems);
router.get('/:itemId', authMiddleware, itemController.getItemById);

router.post('/', authMiddleware, itemController.createItem);
router.put('/:itemId', authMiddleware, itemController.updateItem);
router.delete('/:itemId', authMiddleware, itemController.deleteItem);

export default router;

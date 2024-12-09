import itemService from './items.service.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
class ItemController {
    async createItem(req, res, next) {
        try {
            const { date, description, image, official, price, title } = req.body;
            const itemId = uuidv4();

            const itemData = { date, description, image, official, price, title };
            await itemService.createItem(itemId, itemData);
            res.status(201).json({
                success: true,
                message: 'Item created successfully',
                data: itemData
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllItems(req, res, next) {
        try {
            const items = await itemService.getAllItems();
            res.status(200).json({
                success: true,
                message: 'Items fetched successfully',
                data: items
            });
        } catch (error) {
            next(error);
        }
    }

    async getItemById(req, res, next) {
        try {
            const { itemId } = req.params;
            const item = await itemService.getItemById(itemId);
            if (item) {
                res.status(200).json({
                    success: true,
                    message: 'Item fetched successfully',
                    data: item
                });
            } else {
                res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: 'Item not found',
                    data: null
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async updateItem(req, res, next) {
        try {
            const { itemId } = req.params;
            const { date, description, image, official, price, title } = req.body;
            const itemData = { date, description, image, official, price, title };
            await itemService.updateItem(itemId, itemData);
            res.status(200).json({
                success: true,
                message: 'Item updated successfully',
                data: itemData
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteItem(req, res, next) {
        try {
            const { itemId } = req.params;
            await itemService.deleteItem(itemId);
            res.status(200).json({
                success: true,
                message: 'Item deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ItemController();

import pointService from './point.service.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
class PointController {
    // Create a new point
    async createPoint(req, res, next) {
        try {
            const { date, description, image, official, price, title } = req.body;
            const pointId = uuidv4();

            const pointData = { date, description, image, official, price, title };
            await pointService.createPoint(pointId, pointData);
            res.status(201).json({
                success: true,
                message: 'Point created successfully',
                data: pointData
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all points
    async getAllPoints(req, res, next) {
        try {
            const points = await pointService.getAllPoints();
            res.status(200).json({
                success: true,
                message: 'Points fetched successfully',
                data: points
            });
        } catch (error) {
            next(error);
        }
    }

    // Get an point by ID
    async getPointById(req, res, next) {
        try {
            const { pointId } = req.params;
            const point = await pointService.getPointById(pointId);
            if (point) {
                res.status(200).json({
                    success: true,
                    message: 'Point fetched successfully',
                    data: point
                });
            } else {
                res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: 'Point not found',
                    data: null
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // Update an existing point
    async updatePoint(req, res, next) {
        try {
            const { pointId } = req.params;
            const { date, description, image, official, price, title } = req.body;
            const pointData = { date, description, image, official, price, title };
            await pointService.updatePoint(pointId, pointData);
            res.status(200).json({
                success: true,
                message: 'Point updated successfully',
                data: pointData
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete an point by ID
    async deletePoint(req, res, next) {
        try {
            const { pointId } = req.params;
            await pointService.deletePoint(pointId);
            res.status(200).json({
                success: true,
                message: 'Point deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new PointController();

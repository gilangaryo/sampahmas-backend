import pointRepository from './point.repository.js';

class PointService {
    // Create a new point
    async createPoint(pointId, pointData) {
        await pointRepository.createPoint(pointId, pointData);
    }

    // Get all points
    async getAllPoints() {
        return await pointRepository.getAllPoints();
    }

    // Get a specific point by ID
    async getPointById(pointId) {
        return await pointRepository.getPointById(pointId);
    }

    // Update an existing point
    async updatePoint(pointId, pointData) {
        await pointRepository.updatePoint(pointId, pointData);
    }

    // Delete an point by ID
    async deletePoint(pointId) {
        const deleted = await pointRepository.deletePoint(pointId);
        if (!deleted) throw new Error('Point not found');
    }
}

export default new PointService();

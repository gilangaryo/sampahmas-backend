import { db } from '../database/databaseAdmin.js';

class PointRepository {
    // Create a new point
    async createPoint(pointId, pointData) {
        pointData.pointId = pointId;
        const ref = db.ref(`point/${pointId}`);
        await ref.set(pointData);
    }

    // Get all points
    async getAllPoints() {
        const ref = db.ref('point');
        [1, 2, 3, 4, 5,]
        const snapshot = await ref.once('value');
        return snapshot.val();
    }

    // Get a point by ID
    async getPointById(pointId) {
        const ref = db.ref(`point/${pointId}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    }

    // Update an existing point
    async updatePoint(pointId, pointData) {
        const ref = db.ref(`point/${pointId}`);
        await ref.update(pointData);
    }

    // Delete an point by ID
    async deletePoint(pointId) {
        const ref = db.ref(`point/${pointId}`);
        ref.once('value');
        ref.remove();
    }
}

export default new PointRepository();

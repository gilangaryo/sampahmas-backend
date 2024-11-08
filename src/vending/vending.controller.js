// controllers/vending.controller.js
import VendingService from './vending.service.js';

class VendingController {
    async upload(req, res, next) {
        try {
            if (
                !req.body ||
                !req.headers['content-type'] ||
                req.headers['content-type'] !== 'image/jpeg'
            ) {
                return res.status(400).send('No image uploaded or incorrect content type');
            }

            const imageBuffer = req.body;

            const filePath = await VendingService.uploadFile(imageBuffer);
            return res.status(200).json({
                success: true,
                status: 200,
                message: 'Image uploaded successfully',
                filePath: filePath,
            });
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async addLocation(req, res) {
        const { locationId, latitude, longitude, ...locationData } = req.body;
        try {
            await VendingService.addLocation(locationId, latitude, longitude, locationData);
            return res.status(201).json({
                status: 201,
                message: "Location added successfully",
                data: null,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
            });
        }
    }

    async getLocationById(req, res) {
        const { locationId } = req.params;
        try {
            const location = await VendingService.getLocationById(locationId);
            return res.status(200).json({
                status: 200,
                message: "Location retrieved successfully",
                data: location,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
            });
        }
    }

    async updateLocation(req, res) {
        const { locationId } = req.params;
        const locationData = req.body;
        try {
            await VendingService.updateLocation(locationId, locationData);
            return res.status(200).json({
                status: 200,
                message: "Location updated successfully",
                data: null,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
            });
        }
    }

    async deleteLocation(req, res) {
        const { locationId } = req.params;
        try {
            await VendingService.deleteLocation(locationId);
            return res.status(200).json({
                status: 200,
                message: "Location deleted successfully",
                data: null,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
            });
        }
    }

    async getLocationsInRadius(req, res) {
        const { latitude, longitude, radius } = req.query;
        try {
            const locations = await VendingService.getLocationsInRadius(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
            return res.status(200).json({
                status: 200,
                message: "Locations retrieved successfully",
                data: locations,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
            });
        }
    }

    // Fungsi untuk mendapatkan semua lokasi
    async getAllLocations(req, res) {
        try {
            const locations = await VendingService.getAllLocations();
            return res.status(200).json({
                status: 200,
                message: "All locations retrieved successfully",
                data: locations,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message,
                data: null,
            });
        }
    }
}

export default new VendingController();

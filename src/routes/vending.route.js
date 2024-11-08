import express from 'express';
import VendingController from '../vending/vending.controller.js';

const router = express.Router();

// Apply express.raw() middleware to this route only
router.post('/upload', express.raw({ type: 'image/jpeg', limit: '10mb' }), VendingController.upload);

router.get('/location/radius', VendingController.getLocationsInRadius);
router.get('/location', VendingController.getAllLocations);
router.post('/location', VendingController.addLocation);
router.get('/location/:locationId', VendingController.getLocationById);
router.put('/location/:locationId', VendingController.updateLocation);
router.delete('/location/:locationId', VendingController.deleteLocation);

export default router;

// services/vending.service.js
import VendingRepository from './vending.repository.js';

class VendingService {
    async uploadFile(imageBuffer) {
        const savedPath = await VendingRepository.saveFile(imageBuffer);
        return savedPath;
       
    }

    async addLocation(locationId, latitude, longitude, locationData) {
        return await VendingRepository.addLocation(locationId, latitude, longitude, locationData);
    }

    async getLocationById(locationId) {
        return await VendingRepository.getLocationById(locationId);
    }

    async updateLocation(locationId, locationData) {
        return await VendingRepository.updateLocation(locationId, locationData);
    }

    async deleteLocation(locationId) {
        return await VendingRepository.deleteLocation(locationId);
    }

    async getLocationsInRadius(latitude, longitude, radius) {
        return await VendingRepository.getLocationsInRadius(latitude, longitude, radius);
    }

    // Menambahkan fungsi untuk mendapatkan semua lokasi
    async getAllLocations() {
        return await VendingRepository.getAllLocations();
    }
}

export default new VendingService();

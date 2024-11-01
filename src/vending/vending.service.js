// services/vending.service.js
import VendingRepository from './vending.repository.js';

class VendingService {
    async uploadFile(imageBuffer) {
        try {
            const savedPath = await VendingRepository.saveFile(imageBuffer);
            return savedPath;
        } catch (error) {
            throw new Error('Error uploading file: ' + error.message);
        }
    }
}

export default new VendingService();

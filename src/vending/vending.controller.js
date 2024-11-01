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
}

export default new VendingController();

// repositories/vending.repository.js
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import sanitize from 'sanitize-filename';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VendingRepository {
    async saveFile(imageBuffer) {
        try {
            // Define the directory where you want to save the uploaded files
            const uploadDir = path.resolve(__dirname, '..', 'uploads'); // Adjust the path as needed

            // Ensure the upload directory exists
            await fs.mkdir(uploadDir, { recursive: true });

            // Generate a unique filename
            const timestamp = Date.now();
            const filename = `image_${timestamp}.jpg`;

            // Sanitize the filename
            const sanitizedFilename = sanitize(filename);

            // Construct the full path where the file will be saved
            const savedPath = path.join(uploadDir, sanitizedFilename);

            // Write the image buffer to a file
            await fs.writeFile(savedPath, imageBuffer);

            return savedPath;
        } catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Error saving file: ' + error.message);
        }
    }
}

export default new VendingRepository();

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Save with unique filename
    }
});

// File filter to allow only JPG, JPEG, and PNG formats
const fileFilter = (req, file, cb) => {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

    // Check if the file format is allowed
    if (allowedFormats.includes(file.mimetype)) {
        cb(null, true);  // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);  // Reject the file
    }
};

// Initialize multer with storage and file type validation
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

export default upload;

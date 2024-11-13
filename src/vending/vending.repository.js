// repositories/vending.repository.js
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import sanitize from 'sanitize-filename';
import { geohashForLocation, geohashQueryBounds, distanceBetween } from 'geofire-common';
import { db } from '../database/databaseAdmin.js';
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

    async addLocation(locationId, latitude, longitude, locationData) {
        const geohash = geohashForLocation([latitude, longitude]).substring(0, 6); // Ambil hanya 6 karakter

        await db.ref(`locations/${locationId}`).set({
            geohash,
            latitude,
            longitude,
            ...locationData
        });
        console.log(`Location ${locationId} added with geohash ${geohash}`);
    }

    // Mengambil semua data lokasi
    async getAllLocations() {
        const snapshot = await db.ref('locations').once('value');
        const locations = [];
        snapshot.forEach((doc) => {
            locations.push({ id: doc.key, ...doc.val() });
        });
        console.log("All locations:", locations);
        return locations;
    }

    // Mengambil lokasi berdasarkan ID
    async getLocationById(locationId) {
        const ref = db.ref(`locations/${locationId}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    }

    // Memperbarui data lokasi
    async updateLocation(locationId, locationData) {
        const ref = db.ref(`locations/${locationId}`);
        await ref.update(locationData);
    }

    // Menghapus lokasi
    async deleteLocation(locationId) {
        const ref = db.ref(`locations/${locationId}`);
        await ref.remove();
    }

    // Mengambil lokasi dalam radius tertentu
    async getLocationsInRadius(latitude, longitude, radiusInKm) {
        const center = [latitude, longitude];
        console.log("Searching locations around:", center);
        console.log("Radius (km):", radiusInKm);

        const bounds = geohashQueryBounds(center, radiusInKm);
        const matchingLocations = [];

        console.log("Calculated bounds for geohash search:", bounds);

        for (const b of bounds) {
            const snapshot = await db.ref('locations')
                .orderByChild('geohash')
                .startAt(b[0])
                .endAt(b[1])
                .once('value');

            console.log("Snapshot for bound", b, ":", snapshot.val());

            snapshot.forEach((doc) => {
                const location = doc.val();
                const distance = distanceBetween([location.latitude, location.longitude], center);

                console.log("Location found:", location, "Distance:", distance);

                if (distance <= radiusInKm) {
                    matchingLocations.push({ id: doc.key, ...location, distance });
                }
            });
        }

        console.log("Locations within radius:", matchingLocations);
        return matchingLocations;
    }
}

export default new VendingRepository();

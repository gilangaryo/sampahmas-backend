import { db } from '../database/databaseAdmin.js';

class ItemRepository {
    // Create a new item
    async createItem(itemId, itemData) {
        itemData.itemId = itemId;
        const ref = db.ref(`item/${itemId}`);
        await ref.set(itemData);
    }

    // Get all items
    async getAllItems() {
        const ref = db.ref('item');
        const snapshot = await ref.once('value');
        return snapshot.val();
    }

    // Get a item by ID
    async getItemById(itemId) {
        const ref = db.ref(`item/${itemId}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    }

    // Update an existing item
    async updateItem(itemId, itemData) {
        const ref = db.ref(`item/${itemId}`);
        await ref.update(itemData);
    }

    // Delete an item by ID
    async deleteItem(itemId) {
        const ref = db.ref(`item/${itemId}`);
        ref.once('value');
        ref.remove();
    }
}

export default new ItemRepository();

import itemRepository from './items.repository.js';

class ItemService {
    // Create a new item
    async createItem(itemId, itemData) {
        await itemRepository.createItem(itemId, itemData);
    }

    // Get all items
    async getAllItems() {
        return await itemRepository.getAllItems();
    }

    // Get a specific item by ID
    async getItemById(itemId) {
        return await itemRepository.getItemById(itemId);
    }

    // Update an existing item
    async updateItem(itemId, itemData) {
        await itemRepository.updateItem(itemId, itemData);
    }

    // Delete an item by ID
    async deleteItem(itemId) {
        const deleted = await itemRepository.deleteItem(itemId);
        if (!deleted) throw new Error('Item not found');
    }
}

export default new ItemService();

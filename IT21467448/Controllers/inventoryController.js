import Inventory from '../Models/inventoryModel.js';

// GET all inventory
export const getAllInventory = async (req, res) => {
  try {
    const inventoryList = await Inventory.find();
    if (!inventoryList || inventoryList.length === 0) {
      return res.status(404).json({ message: 'No inventory found.' });
    }
    return res.status(200).json(inventoryList);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET inventory by productId
export const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      return res.status(404).json({ message: 'No inventory record found for this product.' });
    }
    return res.status(200).json(inventory);
  } catch (error) {
    console.error('Error fetching inventory by product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// CREATE or UPDATE inventory
// Admin or Vendor can do this
export const upsertInventory = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity == null) {
      return res.status(400).json({ message: 'productId and quantity are required.' });
    }

    let inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      // Create new inventory record
      inventory = new Inventory({ productId, quantity });
      await inventory.save();
      return res.status(201).json({ message: 'Inventory created', inventory });
    } else {
      // Update existing record
      inventory.quantity = quantity;
      await inventory.save();
      return res.status(200).json({ message: 'Inventory updated', inventory });
    }
  } catch (error) {
    console.error('Error upserting inventory:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ADJUST inventory (for order or restock). Example usage: increment or decrement
export const adjustInventory = async (req, res) => {
  try {
    const { productId, adjustBy } = req.body;
    if (!productId || !adjustBy) {
      return res.status(400).json({ message: 'productId and adjustBy are required.' });
    }

    const inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      return res.status(404).json({ message: 'No inventory record found to adjust.' });
    }

    inventory.quantity += Number(adjustBy);
    if (inventory.quantity < 0) {
      return res.status(400).json({ message: 'Insufficient stock.' });
    }

    await inventory.save();
    return res.status(200).json({ message: 'Inventory adjusted', inventory });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

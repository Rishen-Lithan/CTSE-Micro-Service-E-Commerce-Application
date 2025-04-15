import express from 'express';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';
import {
  getAllInventory,
  getInventoryByProduct,
  upsertInventory,
  adjustInventory
} from '../Controllers/inventoryController.js';

const router = express.Router();

// Admin or Vendor can create/update inventory
router.post('/', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor), upsertInventory);
// Adjust inventory (e.g. reduce stock after an order, or restock)
router.put('/adjust', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor), adjustInventory);

// Anyone can read inventory
router.get('/', getAllInventory);
router.get('/:productId', getInventoryByProduct);

export default router;

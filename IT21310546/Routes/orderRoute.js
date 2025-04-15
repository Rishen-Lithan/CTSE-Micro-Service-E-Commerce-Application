import express from 'express';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../Controllers/orderController.js';

const router = express.Router();

// Create an order (user must be logged in; no role check here, or allow e.g. user+admin)
router.post('/', createOrder);

// Admin or any authorized role can fetch all orders
router.get('/', getAllOrders);

// Single order
router.get('/:id', getOrderById); // Could add role checks or ownership checks
router.put('/:id', verifyRoles(ROLES_LIST.Admin), updateOrderStatus);
router.delete('/:id', verifyRoles(ROLES_LIST.Admin), deleteOrder);

export default router;

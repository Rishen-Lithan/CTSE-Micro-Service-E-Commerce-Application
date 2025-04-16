import express from 'express';
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart
} from '../Controllers/cartController.js';

const router = express.Router();

// All these require a logged-in user
router.get('/', getCart);
router.post('/', addItemToCart);
router.delete('/remove', removeItemFromCart);
router.delete('/clear', clearCart);

export default router;

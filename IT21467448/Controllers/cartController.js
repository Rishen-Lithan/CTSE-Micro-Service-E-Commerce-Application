import Cart from '../Models/cartModel.js';

// GET the current user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user; // from JWT
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If user doesn't have a cart yet, create an empty one
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error getting cart:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ADD item to the cart or UPDATE item quantity
export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'productId and quantity are required.' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// REMOVE item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'productId is required.' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'No cart found for this user.' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    return res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// CLEAR cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'No cart found.' });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

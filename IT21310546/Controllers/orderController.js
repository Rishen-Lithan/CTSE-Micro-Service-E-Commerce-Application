import Order from '../Models/orderModel.js';

// CREATE an order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, shippingAddress, paymentMethod } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order items required.' });
    }
    if (!totalPrice) {
      return res.status(400).json({ message: 'Total price is required.' });
    }

    // Usually, user info (userId or email) comes from req.user if validated
    const userId = req.user || null;

    const newOrder = new Order({
      userId,
      orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json({ message: 'Order created', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found.' });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE order status (Admin only, for example)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    return res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE order (Admin or authorized user, if you choose)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await order.deleteOne();
    return res.status(200).json({ message: 'Order deleted.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

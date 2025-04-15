import Orders from "../Models/orderModel.js";
import validator from "validator";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

// Function to fetch product by ID from product microservice
const fetchProductById = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/s2/products/${productId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const product = await response.json();
    if (!response.ok)
      throw new Error(product.message || "Product fetch failed");
    return product;
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
};

export const createOrder = async (req, res) => {
  const {
    quantity,
    deliveryNote,
    address,
    product: productId,
    name,
    email,
  } = req.body;

  if (!quantity) {
    return res.status(400).json({ message: "Please select a quantity" });
  } else if (!address) {
    return res.status(400).json({ message: "Please enter the address" });
  } else if (address.length > 250) {
    return res
      .status(400)
      .json({ message: "Address should be less than 250 Characters" });
  } else if (!name) {
    return res.status(400).json({ message: "Please enter the name" });
  } else if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  try {
    const product = await fetchProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.remainingQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient product quantity" });
    }

    if (!product.vendor || !product.vendor._id) {
      return res.status(400).json({ message: "Product vendor is missing" });
    }

    // Save the order
    const createdOrder = await Orders.create({
      quantity,
      deliveryNote,
      address,
      product: productId,
      vendor: product.vendor._id,
      orderStatus: 0,
      name,
      email,
    });

    const populatedOrder = await Orders.findById(createdOrder._id)
      .populate("product")
      .populate("vendor", "email vendorName contact address company");

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Notification from List Master",
      text: `Hello ${name},\n\nYour order has been created successfully!\n\n\nBest Regards,\nList Master`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Order created, but error sending email" });
      }
      console.log("Email sent:", info.response);
      return res.status(201).json(populatedOrder);
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  const orders = await Orders.find();
  if (!orders) return res.status(404).json({ message: "No Orders Found" });
  return res.status(200).json(orders);
};

export const getUserOrders = async (req, res) => {
  const userOrders = await Orders.find({ email: req.body.email });
  if (!userOrders)
    return res.status(404).json({ message: "No Orders found with this User" });
  return res.status(200).json(userOrders);
};

export const getUserOrderById = async (req, res) => {
  if (!req?.body?.email || !req?.body?.id) {
    return res
      .status(400)
      .json({ message: "User email and Order ID are required" });
  }

  try {
    const userOrders = await Orders.find({ email: req.body.email });
    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    const getUserOrder = await Orders.findOne({
      email: req.body.email,
      _id: req.body.id,
    });
    if (!getUserOrder) {
      return res.status(404).json({ message: "No order found with that ID" });
    }

    return res.status(200).json(getUserOrder);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getVendorOrders = async (req, res) => {
  if (!req?.body?.vendor_id) {
    return res.status(400).json({ message: "Vendor ID is required" });
  }

  const vendorOrders = await Orders.find({ vendor: req.body.vendor_id });
  if (!vendorOrders)
    return res.status(404).json({ message: "No orders for Vendor" });
  return res.status(200).json(vendorOrders);
};

export const getVendorOrderById = async (req, res) => {
  if (!req?.body?.vendor_id || !req?.body?.id) {
    return res
      .status(400)
      .json({ message: "Vendor ID & Order ID is required" });
  }

  const getVendorOrder = await Orders.findOne({
    _id: req.body.id,
    vendor: req.body.vendor_id,
  });
  if (!getVendorOrder)
    return res.status(404).json({ message: "Order not Found" });
  return res.status(200).json(getVendorOrder);
};

export const changeOrderStatus = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Order ID required" });
  }

  if (!req?.body?.status) {
    return res.status(400).json({ message: "Order status is required" });
  }

  try {
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "No order found with that ID" });
    }

    order.orderStatus = req.body.status;
    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error changing order status:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const cancelOrder = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Order ID required" });
  }

  try {
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "No order found with that ID" });
    }

    if (order.orderStatus === 1) {
      return res.status(200).json({
        message: "Your order is processing. Cannot cancel the order",
      });
    }

    order.orderStatus = 4;
    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

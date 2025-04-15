import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    // ref: 'Products' if referencing your Product service's model
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new Schema(
  {
    userId: {
      // If referencing a separate Auth service or user model:
      type: String, // or Schema.Types.ObjectId,
      required: true
    },
    orderItems: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true
    },
    shippingAddress: {
      type: String,
      default: ''
    },
    paymentMethod: {
      type: String,
      default: 'COD' // or 'Credit Card', 'Paypal', etc.
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

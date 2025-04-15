import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryNote: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor", // Reference to the Vendor model, if needed
  },
  orderStatus: {
    type: Number, // 0 - Pending || 1 - Processing || 2 - Dispatch || 3 - Delivered || 4 - Cancel
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Orders", orderSchema);

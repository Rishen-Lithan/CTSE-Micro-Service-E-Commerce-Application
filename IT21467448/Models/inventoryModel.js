import mongoose from 'mongoose';
const { Schema } = mongoose;

const inventorySchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    // ref: 'Products' or a product reference from ProductService
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);

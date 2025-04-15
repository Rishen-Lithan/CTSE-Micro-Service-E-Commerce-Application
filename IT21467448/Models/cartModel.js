import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    // ref: 'Products' if referencing your product service
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const cartSchema = new Schema({
  userId: {
    type: String, // or Schema.Types.ObjectId
    required: true,
  },
  items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);

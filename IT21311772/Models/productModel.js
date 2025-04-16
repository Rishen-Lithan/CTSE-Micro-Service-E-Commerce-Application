import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    remainingQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    }
})

export default mongoose.model("Product", productSchema);
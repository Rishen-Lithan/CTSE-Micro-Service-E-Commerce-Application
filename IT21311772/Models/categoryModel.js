import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    categoryStatus: {
        type: Number, // 1 - Active || 0 - Inactive
        required: true,
    }
})

export default mongoose.model('Category', categorySchema);
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Vendor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
})

export default mongoose.model('User', userSchema);
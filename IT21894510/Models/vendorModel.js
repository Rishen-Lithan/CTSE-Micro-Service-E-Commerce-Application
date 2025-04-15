import mongoose from 'mongoose';
const { Schema } = mongoose;

const vendorSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  comments: {
    type: [String],
    default: []
  },
  roles: {
    Vendor: {
      type: Number,
      default: 1984,
    },
    // Additional roles can be added here if needed
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

export default mongoose.model('Vendor', vendorSchema);

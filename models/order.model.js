import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  orderItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
  totalAmount: { 
    type: Number, 
    required: true
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  status: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' },
  trackingNumber: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

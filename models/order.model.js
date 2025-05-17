import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
  orderItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
  totalAmount: { 
    type: Number, 
    required: true
    },
  currency: {
     type: String, 
     default: 'ETB' 
    },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' },
  paymentIntentId: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

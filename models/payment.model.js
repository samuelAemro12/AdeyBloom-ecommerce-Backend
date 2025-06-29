import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order'
   },
  user: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User' 
    },
  paymentIntentId: { type: String },
  amount: { type: Number },
  currency: { 
    type: String, 
    default: 'ETB' 
  },
  status: { type: String },
  provider: { 
    type: String, 
    enum: ['chapa'],
    default: 'chapa'
  },
  paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);

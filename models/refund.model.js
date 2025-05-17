import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  user: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    },
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'denied'], 
    default: 'pending' 
  },
  processedAt: { type: Date },
  adminApprover: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' 
    },
}, { timestamps: true });

export default mongoose.model('Refund', refundSchema);

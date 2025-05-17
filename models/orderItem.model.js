import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
},
  quantity: {
     type: Number, 
     required: true 
    },
  priceAtPurchase: { 
    type: Number, 
    required: true 
},
}, { timestamps: true });

export default mongoose.model('OrderItem', orderItemSchema);

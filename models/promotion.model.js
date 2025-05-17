import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  description: String,
  discountPercent: {
     type: Number, 
     required: true
     },
  startDate: { 
    type: Date, 
    required: true 
},
  endDate: {
     type: Date, 
     required: true 
    },
  products: [{
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Product' 
    }],
}, { timestamps: true });

export default mongoose.model('Promotion', promotionSchema);

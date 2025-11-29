import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  // Optional Telegram ID for bot users. Sparse & unique so existing users are unaffected.
  telegram_id: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('User', userSchema);

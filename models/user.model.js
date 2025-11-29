import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // email remains unique when present but is optional to allow Telegram-only users
  email: { type: String, unique: true, sparse: true },
  // allow missing passwordHash for users created via Telegram auth
  passwordHash: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
  // Optional Telegram identifier for bot users. Sparse + unique so it doesn't
  // collide with existing users and is only enforced when present.
  telegram_id: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);

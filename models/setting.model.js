import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Beauty Products Store' },
  siteDescription: { type: String, default: 'Your one-stop shop for beauty products' },
  adminEmail: { type: String, default: 'admin@beautystore.com' },
  currency: { type: String, default: 'ETB' },
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },
  emailNotifications: { type: Boolean, default: true },
  orderNotifications: { type: Boolean, default: true },
  lowStockAlerts: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Setting', SettingSchema);

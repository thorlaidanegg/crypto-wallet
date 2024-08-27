import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    sparse: true, // Allows multiple null values while maintaining uniqueness for non-null values
  },
  mnemonic: {
    type: String,
    sparse: true, // Use sparse index to allow null values but maintain uniqueness for non-null values
  },
  wallets: {
    type: Number,
  },
  solanaWallets: {
    type: Number,
  },
  ethWallets: {
    type: Number,
  },
  provider: {
    type: String, // e.g., 'google', 'github'
  },
  providerId: {
    type: String,
    sparse: true, // Use sparse index to allow null values but maintain uniqueness for non-null values
  },
}, {
  timestamps: true,
});

// Ensure indexes are properly created (you can drop existing indexes manually if needed)
UserSchema.index({ mnemonic: 1 }, { unique: true, sparse: true });
UserSchema.index({ providerId: 1 }, { unique: true, sparse: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

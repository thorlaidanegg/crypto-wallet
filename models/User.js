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
    unique: true, 
    sparse: true, // Optional: allows multiple null values
  },
  mnemonic: {
    type: String,
    unique: true,
    sparse: true, // Add sparse to allow multiple null values
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
    unique: true,
    sparse: true, // Optional: if providerId can be null
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

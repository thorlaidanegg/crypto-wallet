import mongoose from 'mongoose';

// Define the User schema
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
    unique: true,  // Ensure unique values only for non-null entries
    sparse: true,  // Allow multiple null values
  },
  mnemonic: {
    type: String,
    unique: true,
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
    type: String,  // e.g., 'google', 'github'
  },
  providerId: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.User || mongoose.model('User', UserSchema);

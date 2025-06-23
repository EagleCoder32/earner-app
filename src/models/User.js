import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  points:   { type: Number, default: 0 },
  lastReset:{ type: Date,   default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
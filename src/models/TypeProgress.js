import mongoose from 'mongoose';

const TypeProgressSchema = new mongoose.Schema({
  clerkId:    { type: String, required: true },
  sessionId:  { type: String, required: true },
  setNumber:  { type: Number, required: true },
  redeemedAt: { type: Date,   default: Date.now },
  points:     { type: Number, required: true }
});

export default mongoose.models.TypeProgress ||
       mongoose.model('TypeProgress', TypeProgressSchema);
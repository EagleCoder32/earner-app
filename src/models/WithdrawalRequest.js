// src/models/WithdrawalRequest.js
import mongoose from 'mongoose';

const WithdrawalRequestSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true 
  },
  option: { 
    type: String, 
    required: true 
  },           // e.g. "paypal", "upi", etc.
  tierValue: { 
    type: Number, 
    required: true 
  },           // the numeric value (e.g. 5 for $5 or ₹500)
  tierLabel: { 
    type: String, 
    required: true 
  },           // human label (e.g. "$5", "₹500")
  country: { 
    type: String, 
    required: true 
  },           // what country the user selected
  recipient: {
    name:  { type: String, required: true },
    email: { type: String, required: true }
  },           // payout details
  pointsDeducted: { 
    type: Number, 
    required: true 
  },           // how many points were redeemed
  status: {
    type: String,
    enum: ['Pending','Completed','Rejected'],
    default: 'Pending'
  },           // request state
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid recompiling model on hot reload
export default mongoose.models.WithdrawalRequest ||
       mongoose.model('WithdrawalRequest', WithdrawalRequestSchema);
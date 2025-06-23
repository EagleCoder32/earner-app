// src/models/ArticleProgress.js
import mongoose from 'mongoose';

const ArticleProgressSchema = new mongoose.Schema({
  clerkId:    { type: String, required: true },    // your Clerk user ID
  articleIdx: { type: Number, required: true },    // index of the article from articleList
  sessionId:  { type: String, required: true },    // a unique identifier for the user’s 5‑button session
  redeemedAt: { type: Date,   default: Date.now },  // timestamp when points were awarded
  points:      { type: Number, required: true }  
});

export default mongoose.models.ArticleProgress ||
       mongoose.model('ArticleProgress', ArticleProgressSchema);
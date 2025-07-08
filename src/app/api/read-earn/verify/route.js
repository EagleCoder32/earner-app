// src/app/api/read-earn/verify/route.js

export const runtime = 'edge';         // ← add this!

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

// 🍪 Reuse Your Cookie Cutters: Memoize models
const userSchema = new mongoose.Schema({ clerkId: String, points: Number });
const progressSchema = new mongoose.Schema({
  clerkId: String,
  articleIdx: Number,
  sessionId: String,
  points: Number,
  redeemedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const ArticleProgress = mongoose.models.ArticleProgress || mongoose.model('ArticleProgress', progressSchema);

// 📝 One-Button to Rule Them All: Consolidated error helper
function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  try {
    // 1️⃣ Authenticate with Clerk
    const { userId } = getAuth(req);
    if (!userId) {
      return errorResponse('Unauthenticated', 401);
    }

    // 2️⃣ Parse & validate payload
    const { articleIdx, sessionId } = await req.json();
    if (typeof articleIdx !== 'number' || !sessionId) {
      return errorResponse('Invalid payload');
    }

    // 3️⃣ Keep the Oven Hot: Cached DB connection
    await connectToDatabase();

    // 4️⃣ Prevent double-claim today
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const already = await ArticleProgress.findOne({
      clerkId: userId,
      articleIdx,
      redeemedAt: { $gte: todayStart },
    });
    if (already) {
      return errorResponse('Already claimed today');
    }

    // 5️⃣ Award points & record progress
    const awardPoints = 20;
    await ArticleProgress.create({ clerkId: userId, articleIdx, sessionId, points: awardPoints });

    // 6️⃣ Find or create user and update
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = new User({ clerkId: userId, points: awardPoints });
    } else {
      user.points += awardPoints;
    }
    await user.save();

    // 7️⃣ Return success
    return NextResponse.json({ message: `${awardPoints} points awarded!`, totalPoints: user.points });
  } catch (err) {
    console.error('🔥 Error in /api/read-earn/verify:', err);
    return errorResponse('Internal server error', 500);
  }
}
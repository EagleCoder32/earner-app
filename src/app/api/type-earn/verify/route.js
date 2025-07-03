// src/app/api/type-earn/verify/route.js

export const runtime = 'nodejs';  // Ensure Node.js runtime (not Edge) for server-only imports
import { NextResponse } from 'next/server';
import { getAuth }     from '@clerk/nextjs/server';
import mongoose        from 'mongoose';
import { LRUCache }    from 'lru-cache';             // ✅ Use named export
import { z }           from 'zod';
import { connectToDatabase } from '@/lib/mongodb';

// 🎛️ Rate‑Limiter: one request per user per minute
const rateLimiter = new LRUCache({
  max: 1000,             // maximum number of users tracked
  ttl: 60 * 1000         // 1 minute in milliseconds
});

// 🍪 Memoize Mongoose Models
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  points:  { type: Number, default: 0 }
});
const typeProgressSchema = new mongoose.Schema({
  clerkId:    String,
  sessionId:  String,
  setNumber:  Number,
  points:     Number,
  claimedAt:  { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const TypeProgress = mongoose.models.TypeProgress || mongoose.model('TypeProgress', typeProgressSchema);

// 📝 Declarative Input Validation with Zod
const VerifySchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  setNumber: z.number().int().nonnegative("setNumber must be a non-negative integer")
});

// 🎟️ Centralized Error Response
function errorJSON(msg, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET() {
  // Simple health check
  return NextResponse.json({ status: 'OK', route: '/api/type-earn/verify' });
}

export async function POST(req) {
  // 1) Authentication
  const { userId } = getAuth(req);
  if (!userId) {
    return errorJSON('Unauthenticated', 401);
  }

  // 2) Rate‑Limiting
  const key = `type-earn:${userId}`;
  if (rateLimiter.has(key)) {
    return errorJSON('Too many requests – try again in a minute.', 429);
  }
  rateLimiter.set(key, true);

  // 3) Parse & Validate Input
  let payload;
  try {
    payload = VerifySchema.parse(await req.json());
  } catch (zErr) {
    const first = zErr.errors[0];
    return errorJSON(`Invalid payload: ${first.message}`, 400);
  }
  const { sessionId, setNumber } = payload;

  // 4) Ensure DB Connection (cached)
  await connectToDatabase();

  // 5) Atomic Write: Use MongoDB Transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 5a) Prevent duplicate claim
    const duplicate = await TypeProgress.findOne({
      clerkId:   userId,
      sessionId,
      setNumber
    }).session(session);

    if (duplicate) {
      await session.abortTransaction();
      session.endSession();
      return errorJSON('Already claimed points for this set.', 400);
    }

    // 5b) Record the progress
    const POINTS = 5;
    await TypeProgress.create([{
      clerkId:   userId,
      sessionId,
      setNumber,
      points:    POINTS
    }], { session });

    // 5c) Update (or create) the User’s total points
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $inc: { points: POINTS } },
      { new: true, upsert: true, session }
    );

    // Commit all writes together
    await session.commitTransaction();
    session.endSession();

    // 6) Success Response
    return NextResponse.json({
      message:     `${POINTS} points awarded!`,
      totalPoints: user.points
    });
  } catch (err) {
    // Abort on any error
    await session.abortTransaction();
    session.endSession();
    console.error('🔥 Error in /api/type-earn/verify:', err);
    return errorJSON('Internal server error', 500);
  }
}
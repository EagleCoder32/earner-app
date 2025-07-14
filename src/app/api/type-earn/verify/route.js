// src/app/api/type-earn/verify/route.js
import { NextResponse }              from 'next/server';
import { getAuth }                   from '@clerk/nextjs/server';
import mongoose                      from 'mongoose';
import { LRUCache }                  from 'lru-cache';
import { z }                         from 'zod';
import { connectToDatabase }         from '@/lib/mongodb';

// ——————————————————————
// 1) Rate‑Limiter Setup
// ——————————————————————
const rateLimiter = new LRUCache({ max: 500, ttl: 60 * 1000 });
function checkRateLimit(userId) {
  const key = `type-earn:${userId}`;
  if (rateLimiter.has(key)) {
    return false;
  }
  rateLimiter.set(key, true);
  return true;
}

// ——————————————————————
// 2) Declarative Payload Schema
// ——————————————————————
const VerifySchema = z.object({
  sessionId:  z.string().min(1),
  setNumber:  z.number().int().nonnegative(),
});

// ——————————————————————
// 3) Memoized Models
// ——————————————————————
const userSchema = new mongoose.Schema({
  clerkId: String,
  points: { type: Number, default: 0 },
});
const typeProgressSchema = new mongoose.Schema({
  clerkId:    String,
  sessionId:  String,
  setNumber:  Number,
  points:     Number,
  createdAt: { type: Date, default: Date.now },
});
const User         = mongoose.models.User         || mongoose.model('User', userSchema);
const TypeProgress = mongoose.models.TypeProgress || mongoose.model('TypeProgress', typeProgressSchema);

// ——————————————————————
// 4) Error Helper
// ——————————————————————
function errorJSON(msg, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

// ——————————————————————
// 5) Health‑check (GET)
// ——————————————————————
export async function GET() {
  return NextResponse.json({ status: 'OK', route: '/api/type-earn/verify' });
}

// ——————————————————————
// 6) Core Logic (POST)
// ——————————————————————
export async function POST(req) {
  console.log('🟢 [type-earn/verify] POST hit');
  try {
    // — Authentication —
    const { userId } = getAuth(req);
    if (!userId) {
      console.warn('🔒 Unauthenticated request');
      return errorJSON('Unauthenticated', 401);
    }

    // — Rate‑Limit —
    if (!checkRateLimit(userId)) {
      console.warn('🐌 Rate limit exceeded');
      return errorJSON('Too many requests, please wait a moment.', 429);
    }

    // — Validate & Parse Payload —
    let payload;
    try {
      payload = VerifySchema.parse(await req.json());
    } catch (err) {
      console.warn('⚠️ Payload validation error', err);
      return errorJSON('Invalid payload', 400);
    }
    const { sessionId, setNumber } = payload;
    console.log('📥 Payload:', payload);

    // — Connect (cached) —
    await connectToDatabase();
    console.log('🗄️ Connected to DB');

    // — Start Transaction —
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();
    try {
      // — Prevent Duplicate —
      const exists = await TypeProgress.findOne(
        { clerkId: userId, sessionId, setNumber },
        null,
        { session: dbSession }
      );
      if (exists) {
        console.info('🚫 Duplicate claim');
        await dbSession.abortTransaction();
        return errorJSON('Already claimed points for this set.', 400);
      }

      // — Record Progress —
      const POINTS = 5;
      await TypeProgress.create(
        [{ clerkId: userId, sessionId, setNumber, points: POINTS }],
        { session: dbSession }
      );

      // — Update User Points (upsert) —
      const user = await User.findOneAndUpdate(
        { clerkId: userId },
        { $inc: { points: POINTS } },
        { new: true, upsert: true, session: dbSession }
      );

      // — Commit →
      await dbSession.commitTransaction();

      console.log('✅ Points awarded, user total:', user.points);
      return NextResponse.json({
        message:     `${POINTS} points awarded!`,
        totalPoints: user.points,
      });
    } catch (txErr) {
      await dbSession.abortTransaction();
      console.error('🔥 Transaction error:', txErr);
      return errorJSON('Internal server error', 500);
    } finally {
      dbSession.endSession();
    }

  } catch (err) {
    console.error('🔥 Unexpected error in /api/type-earn/verify:', err);
    return errorJSON('Internal server error', 500);
  }
}
